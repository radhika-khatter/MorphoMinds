from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
import os

from backend_english_level4.decision.rule_engine import evaluate_rules

# ---------------------------------------------------
# Case-insensitive letters (visually identical)
# ---------------------------------------------------

CASE_INSENSITIVE_LETTERS = {
    "u", "v", "o", "c", "s", "w", "x", "z", "m", "y"
}

MIRROR_LETTERS = {"b", "d", "p", "q"}

router = APIRouter(prefix="/level4", tags=["Level 4"])

# ---------------------------------------------------
# Schemas
# ---------------------------------------------------

class Point(BaseModel):
    x: float
    y: float
    t: int

class DrawingRequest(BaseModel):
    target_letter: str
    canvas_size: dict
    strokes: List[List[Point]]

# ---------------------------------------------------
# Model Setup
# ---------------------------------------------------
# ---------------------------------------------------
# Model Setup
# ---------------------------------------------------

import torch
import torch.nn.functional as F
import numpy as np
import cv2
from torchvision import transforms, datasets
from backend_english_level4.models.efficientnet_model import get_efficientnet_b0

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------- PATHS (FIXED) ----------

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)

MODEL_PATH = os.path.join(BACKEND_DIR, "efficientnet_b0.pth")
DATASET_DIR = os.path.join(BACKEND_DIR, "dataset", "processed", "train")

# ---------- LOAD MODEL ----------

model = get_efficientnet_b0(num_classes=52)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# ---------- CLASS MAPPING (SAFE) ----------

if not os.path.exists(DATASET_DIR):
    print(f"[WARN] Dataset not found at {DATASET_DIR}")
    CLASS_MAPPING = {}
else:
    temp_dataset = datasets.ImageFolder(root=DATASET_DIR)
    CLASS_MAPPING = {v: k for k, v in temp_dataset.class_to_idx.items()}

# ---------- TRANSFORM ----------

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
])

# ---------------------------------------------------
# Rasterization
# ---------------------------------------------------

def strokes_to_tensor(strokes, canvas_size):
    width = canvas_size["width"]
    height = canvas_size["height"]

    img = np.zeros((height, width), dtype=np.uint8)

    for stroke in strokes:
        for i in range(len(stroke) - 1):
            p1 = stroke[i]
            p2 = stroke[i + 1]

            x1 = int(p1.x * width)
            y1 = int(p1.y * height)
            x2 = int(p2.x * width)
            y2 = int(p2.y * height)

            cv2.line(img, (x1, y1), (x2, y2), 255, thickness=2)

    coords = cv2.findNonZero(img)

    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        pad = int(0.15 * max(w, h))

        x = max(x - pad, 0)
        y = max(y - pad, 0)
        w = min(w + 2 * pad, width - x)
        h = min(h + 2 * pad, height - y)

        img = img[y:y+h, x:x+w]
    else:
        img = np.zeros((64, 64), dtype=np.uint8)

    h, w = img.shape
    size = max(h, w)
    square = np.zeros((size, size), dtype=np.uint8)

    y_offset = (size - h) // 2
    x_offset = (size - w) // 2
    square[y_offset:y_offset+h, x_offset:x_offset+w] = img
    img = square

    img = cv2.dilate(img, np.ones((3, 3), np.uint8), iterations=1)
    img = cv2.resize(img, (64, 64))
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

    return transform(img).unsqueeze(0)

# ---------------------------------------------------
# Endpoint
# ---------------------------------------------------

@router.post("/evaluate")
def evaluate_level4(data: DrawingRequest):

    # Save sample
    os.makedirs("backend/data/user_samples", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    with open(f"backend/data/user_samples/{timestamp}.json", "w") as f:
        json.dump(data.dict(), f, indent=2)

    # ---------------- CNN ----------------

    image_tensor = strokes_to_tensor(data.strokes, data.canvas_size).to(device)

    with torch.no_grad():
        outputs = model(image_tensor)
        probs = F.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    cnn_confidence = confidence.item() * 100
    predicted_class = predicted.item()
    folder_name = CLASS_MAPPING.get(predicted_class, "unknown")

    if folder_name.startswith("lower_"):
        cnn_predicted_letter = folder_name.replace("lower_", "")
    elif folder_name.startswith("upper_"):
        cnn_predicted_letter = folder_name.replace("upper_", "")
    else:
        cnn_predicted_letter = folder_name

    target = data.target_letter

    # ---------------- Case Normalization ----------------

    if (
        target.lower() == cnn_predicted_letter.lower()
        and target.lower() in CASE_INSENSITIVE_LETTERS
    ):
        cnn_predicted_letter = target

    # ===================================================
    # MIRROR LETTERS (b,d,p,q)
    # ===================================================

    if target in MIRROR_LETTERS:
        rule_result = evaluate_rules(target, data.strokes)
        rule_score = rule_result.get("score", 0)

        status = "correct" if rule_score >= 70 else "mirror_error"

        return {
            "target_letter": target,
            "cnn": {
                "predicted_letter": cnn_predicted_letter,
                "confidence": round(cnn_confidence, 2)
            },
            "rules": {
                "score": rule_score,
                "feedback": rule_result.get("reasons", [])
            },
            "hybrid": {
                "final_score": rule_score,
                "status": status
            }
        }

    # ===================================================
    # NON-MIRROR LETTERS
    # ===================================================

    # 1️⃣ Wrong letter immediately
    if cnn_predicted_letter != target:
        return {
            "target_letter": target,
            "cnn": {
                "predicted_letter": cnn_predicted_letter,
                "confidence": round(cnn_confidence, 2)
            },
            "rules": {
                "score": 0,
                "feedback": []
            },
            "hybrid": {
                "final_score": 0,
                "status": "wrong_letter"
            }
        }

    # 2️⃣ Correct letter → check stroke count
    rule_result = evaluate_rules(target, data.strokes)
    rule_score = rule_result.get("score", 0)

    final_score = (0.7 * cnn_confidence) + (0.3 * rule_score)

    if rule_score == 40:
        status = "correct_letter_incorrect_stroking_pattern"
    elif final_score >= 75:
        status = "correct"
    elif final_score >= 55:
        status = "almost_correct"
    else:
        status = "wrong"

    return {
        "target_letter": target,
        "cnn": {
            "predicted_letter": cnn_predicted_letter,
            "confidence": round(cnn_confidence, 2)
        },
        "rules": {
            "score": rule_score,
            "feedback": rule_result.get("reasons", [])
        },
        "hybrid": {
            "final_score": round(final_score, 2),
            "status": status
        }
    }