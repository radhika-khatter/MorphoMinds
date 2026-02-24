from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import tensorflow as tf

from preprocessing.stroke_capture.load_image import load_image_from_frontend
from preprocessing.image_generation.to_tensor import preprocess_to_tensor
from rules.rule_engine import apply_rules

# =========================
# MODEL LOADING
# =========================

MODEL_PATH = "mirror_letter_cnn_correct_only.h5"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

LABELS = ["b", "d", "p", "q"]
CONFIDENCE_THRESHOLD = 0.995

MIRROR_MAP = {
    "b": "d",
    "d": "b",
    "p": "q",
    "q": "p"
}

# =========================
# FASTAPI APP
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST SCHEMA
# =========================

class ImagePayload(BaseModel):
    image: str
    strokes: list
    letter_hint: str

# =========================
# API ENDPOINT
# =========================

@app.post("/upload")
def upload_image(payload: ImagePayload):

    # -------- CNN INFERENCE --------
    img_np = load_image_from_frontend(payload.image)
    _, tensor_for_model = preprocess_to_tensor(img_np)

    if hasattr(tensor_for_model, "detach"):
        tensor_for_model = tensor_for_model.detach().cpu().numpy()

    if tensor_for_model.shape == (1, 1, 28, 28):
        tensor_for_model = np.transpose(tensor_for_model, (0, 2, 3, 1))

    preds = model.predict(tensor_for_model)
    class_id = int(np.argmax(preds))
    confidence = float(np.max(preds))

    # -------- VALID ALPHABET CHECK --------
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "status": "invalid",
            "predicted_letter": None,
            "confidence": confidence,
            "message": "No valid character drawn"
        }

    predicted_letter = LABELS[class_id]
    expected_letter = payload.letter_hint

    # -------- MIRROR CHECK --------
    if MIRROR_MAP.get(predicted_letter) == expected_letter:
        return {
            "status": "mirrored",
            "predicted_letter": predicted_letter,
            "confidence": confidence,
            "message": "This is a mirrored letter"
        }

    # -------- WRONG LETTER (NOT MIRROR) --------
    if predicted_letter != expected_letter:
        return {
            "status": "wrong_letter",
            "predicted_letter": predicted_letter,
            "confidence": confidence,
            "message": f"You drew '{predicted_letter}', you were supposed to draw '{expected_letter}'"
        }

    # -------- RULE ENGINE (ONLY AFTER LETTER MATCHES) --------
    rule_results = apply_rules(expected_letter, payload.strokes)
    stroke_order_ok = rule_results["stroke_order_ok"]

    # -------- FINAL PEDAGOGICAL FEEDBACK --------
    if stroke_order_ok:
        status = "correct"
        message = "Good job! You drew the correct letter in the correct way"
    else:
        status = "correct_but_wrong_stroke"
        message = "You drew the correct letter but the stroking order was wrong"

    return {
        "status": status,
        "predicted_letter": predicted_letter,
        "confidence": confidence,
        "rule_details": rule_results,
        "message": message
    }
