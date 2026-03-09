# app.py  ✅ FULL FILE
# Browser Canvas app (Flask) + Stroke validation + PyTorch CNN (auto-load)
#
# Directory structure (as per your screenshot):
#   maths/maths_level_2/digit_web_app/
#     app.py
#     digit_cnn_best.pth
#     digit_cnn.pth
#     digit_templates.json
#     templates/
#       index.html
#
# RUN (IMPORTANT):
#   cd "D:\project nes\maths\maths_level_2\digit_web_app"
#   python app.py
#
# Then open:
#   http://127.0.0.1:5000

import json
import math
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple, Dict, Optional

import numpy as np
from PIL import Image, ImageDraw
from flask import Flask, request, jsonify, send_from_directory

# -----------------------------
# PyTorch safe-import (no crash)
# -----------------------------
TORCH_IMPORT_ERR: Optional[str] = None
try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
except Exception as e:
    torch = None
    nn = None
    F = None
    TORCH_IMPORT_ERR = str(e)

# -----------------------------
# Paths (MATCH YOUR SCREENSHOT)
# -----------------------------
APP_DIR = Path(__file__).resolve().parent                     # .../digit_web_app
TEMPLATES_DIR = APP_DIR / "templates"                         # .../digit_web_app/templates
INDEX_HTML_PATH = TEMPLATES_DIR / "index.html"                # .../digit_web_app/templates/index.html

TEMPLATES_DB_PATH = APP_DIR / "digit_templates.json"          # .../digit_web_app/digit_templates.json

# Prefer these model names (in this order)
PREFERRED_MODEL_FILES = [
    APP_DIR / "digit_cnn_best.pth",
    APP_DIR / "digit_cnn_best.pt",
    APP_DIR / "digit_cnn.pth",
    APP_DIR / "digit_cnn.pt",
]

# Optional override (if you ever want)
# PowerShell:
#   $env:DIGIT_CNN_MODEL="D:\...\some_model.pth"
ENV_MODEL_KEY = "DIGIT_CNN_MODEL"

# -----------------------------
# Types
# -----------------------------
Point = Tuple[float, float]
Stroke = List[Point]
Strokes = List[Stroke]

# -----------------------------
# Geometry helpers
# -----------------------------
def dist(a: Point, b: Point) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])

def polyline_length(pts: Stroke) -> float:
    if len(pts) < 2:
        return 0.0
    return sum(dist(pts[i - 1], pts[i]) for i in range(1, len(pts)))

def resample_stroke(pts: Stroke, n: int = 64) -> Stroke:
    """Resample stroke to exactly n points evenly spaced along arc length."""
    if len(pts) == 0:
        return []
    if len(pts) == 1:
        return [pts[0]] * n

    total = polyline_length(pts)
    if total <= 1e-6:
        return [pts[0]] * n

    step = total / (n - 1)
    out = [pts[0]]
    accum = 0.0
    i = 1
    prev = pts[0]

    while i < len(pts):
        cur = pts[i]
        d = dist(prev, cur)
        if (accum + d) >= step:
            t = (step - accum) / max(d, 1e-9)
            nx = prev[0] + t * (cur[0] - prev[0])
            ny = prev[1] + t * (cur[1] - prev[1])
            newp = (nx, ny)
            out.append(newp)
            prev = newp
            accum = 0.0
        else:
            accum += d
            prev = cur
            i += 1

    while len(out) < n:
        out.append(out[-1])

    return out[:n]

def normalize_strokes(strokes: Strokes) -> Strokes:
    """Translate+scale strokes to a unit box (0..1) while preserving shape."""
    all_pts = [p for s in strokes for p in s]
    if not all_pts:
        return strokes

    xs = [p[0] for p in all_pts]
    ys = [p[1] for p in all_pts]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)

    w = max(maxx - minx, 1e-6)
    h = max(maxy - miny, 1e-6)
    scale = max(w, h)

    norm: Strokes = []
    for s in strokes:
        ns = [((p[0] - minx) / scale, (p[1] - miny) / scale) for p in s]
        norm.append(ns)
    return norm

def stroke_direction_vec(s: Stroke) -> Tuple[float, float]:
    """Direction vector from first to last point."""
    if len(s) < 2:
        return (0.0, 0.0)
    return (s[-1][0] - s[0][0], s[-1][1] - s[0][1])

def angle_between(v1: Tuple[float, float], v2: Tuple[float, float]) -> float:
    """Angle in degrees between v1 and v2."""
    x1, y1 = v1
    x2, y2 = v2
    n1 = math.hypot(x1, y1)
    n2 = math.hypot(x2, y2)
    if n1 < 1e-9 or n2 < 1e-9:
        return 0.0
    dot = (x1 * x2 + y1 * y2) / (n1 * n2)
    dot = max(-1.0, min(1.0, dot))
    return math.degrees(math.acos(dot))

def signed_area(stroke: Stroke) -> float:
    """Signed area proxy for stroke winding (useful for loops/circles)."""
    if len(stroke) < 3:
        return 0.0
    a = 0.0
    for i in range(1, len(stroke)):
        x1, y1 = stroke[i - 1]
        x2, y2 = stroke[i]
        a += (x1 * y2 - x2 * y1)
    return 0.5 * a

def mean_point_distance(a: Stroke, b: Stroke) -> float:
    """Mean Euclidean distance between corresponding points (same length)."""
    if not a or not b or len(a) != len(b):
        return 1e9
    return float(np.mean([dist(a[i], b[i]) for i in range(len(a))]))

# -----------------------------
# Templates I/O
# -----------------------------
@dataclass
class Template:
    strokes: Strokes  # normalized strokes (0..1)

    def to_dict(self) -> Dict:
        return {"strokes": self.strokes}

    @staticmethod
    def from_dict(d: Dict) -> "Template":
        return Template(strokes=d["strokes"])

def load_templates(path: Path) -> Dict[str, Template]:
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    out: Dict[str, Template] = {}
    for k, v in data.items():
        out[str(k)] = Template.from_dict(v)
    return out

def save_templates(path: Path, templates: Dict[str, Template]) -> None:
    data = {k: t.to_dict() for k, t in templates.items()}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# -----------------------------
# CNN model (safe: only define if torch works)
# NOTE: If your training architecture differs, replace this class.
# -----------------------------
if nn is not None:
    class DigitCNN(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(1, 32, 3, padding=1)
            self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
            self.pool = nn.MaxPool2d(2, 2)
            self.fc1 = nn.Linear(64 * 7 * 7, 128)
            self.fc2 = nn.Linear(128, 10)

        def forward(self, x):
            x = self.pool(F.relu(self.conv1(x)))  # 28->14
            x = self.pool(F.relu(self.conv2(x)))  # 14->7
            x = x.view(x.size(0), -1)
            x = F.relu(self.fc1(x))
            return self.fc2(x)
else:
    DigitCNN = None

def _strip_module_prefix(sd: Dict) -> Dict:
    if not isinstance(sd, dict) or not sd:
        return sd
    keys = list(sd.keys())
    if all(isinstance(k, str) and k.startswith("module.") for k in keys):
        return {k.replace("module.", "", 1): v for k, v in sd.items()}
    return sd

def _extract_state_dict(obj):
    """Support common checkpoint formats."""
    if isinstance(obj, dict):
        for k in ("state_dict", "model_state_dict", "net", "model"):
            if k in obj and isinstance(obj[k], dict):
                return obj[k]
        # raw state_dict
        return obj
    return None

def find_model_path() -> Tuple[Optional[str], str]:
    """Find model path using env override or preferred files or newest .pth/.pt."""
    envp = os.getenv(ENV_MODEL_KEY, "").strip()
    if envp:
        p = Path(envp)
        if p.exists() and p.is_file():
            return str(p), f'Using {ENV_MODEL_KEY}.'
        return None, f'{ENV_MODEL_KEY} set but file not found: "{envp}"'

    for p in PREFERRED_MODEL_FILES:
        if p.exists() and p.is_file():
            return str(p), f"Found preferred model: {p.name}"

    candidates = list(APP_DIR.glob("*.pth")) + list(APP_DIR.glob("*.pt"))
    if candidates:
        candidates.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        return str(candidates[0]), f"Found newest model file: {candidates[0].name}"

    return None, "No model file (.pth/.pt) found in digit_web_app folder."

def load_cnn_model(model_path: Optional[str], device: str = "cpu"):
    """Loads either TorchScript or state_dict/checkpoint into DigitCNN."""
    if torch is None or DigitCNN is None:
        msg = "PyTorch not available."
        if TORCH_IMPORT_ERR:
            msg += f" Import error: {TORCH_IMPORT_ERR}"
        return None, msg

    if not model_path:
        return None, "No model path configured."

    if not os.path.exists(model_path):
        return None, f"Model not found: {model_path}"

    # Try TorchScript
    try:
        m = torch.jit.load(model_path, map_location=device)
        m.eval()
        return m, "Loaded TorchScript model ✅"
    except Exception:
        pass

    # Try state_dict/checkpoint
    try:
        m = DigitCNN().to(device)
        obj = torch.load(model_path, map_location=device)
        sd = _extract_state_dict(obj)
        if sd is None:
            raise RuntimeError("Unrecognized checkpoint format (not TorchScript / not a state_dict dict).")
        sd = _strip_module_prefix(sd)
        m.load_state_dict(sd, strict=False)
        m.eval()
        return m, "Loaded state_dict/checkpoint ✅ (strict=False)"
    except Exception as e:
        return None, f"Failed to load model: {e}"

# -----------------------------
# Render strokes to 28x28 for CNN
# -----------------------------
def strokes_to_28x28(strokes: Strokes, canvas_size: int, thickness: int = 14) -> Image.Image:
    img = Image.new("L", (canvas_size, canvas_size), 255)
    draw = ImageDraw.Draw(img)

    for s in strokes:
        if len(s) < 2:
            continue
        for i in range(1, len(s)):
            draw.line([s[i - 1], s[i]], fill=0, width=thickness)

    arr = np.array(img)
    ys, xs = np.where(arr < 250)
    if len(xs) > 0 and len(ys) > 0:
        minx, maxx = xs.min(), xs.max()
        miny, maxy = ys.min(), ys.max()
        pad = 20
        minx = max(minx - pad, 0)
        miny = max(miny - pad, 0)
        maxx = min(maxx + pad, canvas_size - 1)
        maxy = min(maxy + pad, canvas_size - 1)
        img = img.crop((minx, miny, maxx + 1, maxy + 1))

    img = img.resize((28, 28), resample=Image.Resampling.BILINEAR)
    return img

def pil_to_tensor_mnist(img28: Image.Image, device: str):
    arr = np.array(img28).astype(np.float32)
    arr = 255.0 - arr
    arr = arr / 255.0
    x = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0)  # [1,1,28,28]
    return x.to(device)

# -----------------------------
# Stroke validation
# -----------------------------
@dataclass
class StrokeCheckResult:
    ok: bool
    per_stroke_ok: List[bool]
    messages: List[str]

def validate_strokes(
    user: Strokes,
    tmpl: Template,
    direction_deg_tol: float = 55.0,
    shape_mean_dist_tol: float = 0.20,
    require_same_count: bool = True
) -> StrokeCheckResult:
    msgs: List[str] = []

    if require_same_count and len(user) != len(tmpl.strokes):
        msgs.append(f"Stroke count wrong: you used {len(user)}, expected {len(tmpl.strokes)}.")

    n = min(len(user), len(tmpl.strokes))
    if n == 0:
        return StrokeCheckResult(False, [], ["No strokes to compare."])

    user_n = normalize_strokes(user)
    tmpl_n = tmpl.strokes

    per_ok: List[bool] = []
    all_ok = True

    for i in range(n):
        us = resample_stroke(user_n[i], 64)
        ts = resample_stroke(tmpl_n[i], 64)

        ang = angle_between(stroke_direction_vec(us), stroke_direction_vec(ts))
        dir_ok = ang <= direction_deg_tol

        md = mean_point_distance(us, ts)
        shape_ok = md <= shape_mean_dist_tol

        ua = signed_area(us)
        ta = signed_area(ts)
        winding_ok = True
        if abs(ta) > 0.004:
            if abs(ua) > 0.002 and (ua * ta) < 0:
                winding_ok = False

        ok_i = dir_ok and shape_ok and winding_ok
        per_ok.append(ok_i)

        if not ok_i:
            all_ok = False
            reason = []
            if not dir_ok:
                reason.append(f"direction off (angle {ang:.0f}°)")
            if not winding_ok:
                reason.append("loop direction reversed")
            if not shape_ok:
                reason.append(f"shape mismatch (dist {md:.2f})")
            msgs.append(f"Stroke {i+1} wrong: " + ", ".join(reason))

    if require_same_count and len(user) != len(tmpl.strokes):
        all_ok = False

    if all_ok and not msgs:
        msgs.append("Strokes look correct ✅")

    return StrokeCheckResult(all_ok, per_ok, msgs)

# -----------------------------
# Flask App
# -----------------------------
templates_db: Dict[str, Template] = load_templates(TEMPLATES_DB_PATH)

device = "cuda" if (torch and torch.cuda.is_available()) else "cpu"
found_model_path, model_find_status = find_model_path()
model, model_status = load_cnn_model(found_model_path, device)

app = Flask(__name__)

@app.get("/")
def index():
    # Serve: digit_web_app/templates/index.html
    if INDEX_HTML_PATH.exists():
        return send_from_directory(str(TEMPLATES_DIR), "index.html")
    # fallback if missing
    return (
        "<h3>templates/index.html not found</h3>"
        f"<p>Expected at: {INDEX_HTML_PATH}</p>"
        "<p>Create templates/index.html or restore it.</p>"
    ), 404

@app.get("/status")
def status():
    return jsonify({
        "python_exe": sys.executable,
        "cwd": os.getcwd(),
        "app_dir": str(APP_DIR),
        "device": device,
        "torch_error": TORCH_IMPORT_ERR,
        "has_model": model is not None,
        "model_status": model_status,
        "model_path": found_model_path,
        "model_find_status": model_find_status,
        "templates_db_path": str(TEMPLATES_DB_PATH),
        "templates_saved": sorted(list(templates_db.keys())),
    })

def run_cnn(strokes: Strokes, canvas_size: int) -> Tuple[Optional[int], Optional[float], str]:
    if model is None or torch is None:
        return None, None, "CNN not loaded."
    if not strokes:
        return None, None, "No drawing to scan."

    img28 = strokes_to_28x28(strokes, canvas_size, thickness=14)
    x = pil_to_tensor_mnist(img28, device)

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)[0]
        pred = int(torch.argmax(probs).item())
        conf = float(probs[pred].item())

    return pred, conf, "ok"

@app.post("/save_template")
def save_template_api():
    data = request.get_json(force=True)
    target = str(data.get("target", "0"))
    strokes = data.get("strokes", [])
    if not strokes:
        return jsonify({"ok": False, "message": "Nothing to save. Draw first."}), 400

    templates_db[target] = Template(strokes=normalize_strokes(strokes))
    save_templates(TEMPLATES_DB_PATH, templates_db)
    return jsonify({"ok": True, "message": f"Saved template for digit {target} ✅"})

@app.post("/check")
def check_api():
    data = request.get_json(force=True)
    target = str(data.get("target", "0"))
    strokes = data.get("strokes", [])
    canvas_size = int(data.get("canvas_size", 420))

    pred, conf, cnn_status = run_cnn(strokes, canvas_size)
    if pred is not None:
        ok_digit = (str(pred) == target)
        cnn_line = f"CNN predicts: {pred} (conf {conf:.2f}) → " + ("Correct ✅" if ok_digit else "Wrong ❌")
    else:
        cnn_line = f"CNN: not available ({cnn_status})"

    if target not in templates_db:
        msg = f"No template for digit {target}. Draw it correctly once and click 'Save Template' first."
        return jsonify({
            "ok": False,
            "per_stroke_ok": [],
            "messages": [msg, cnn_line],
            "cnn": {"pred": pred, "conf": conf, "status": cnn_status},
        })

    result = validate_strokes(strokes, templates_db[target])
    messages = result.messages[:] + [cnn_line]

    return jsonify({
        "ok": result.ok,
        "per_stroke_ok": result.per_stroke_ok,
        "messages": messages,
        "cnn": {"pred": pred, "conf": conf, "status": cnn_status},
    })

if __name__ == "__main__":
    print("\n--- RUN INFO ---")
    print("python:", sys.executable)
    print("cwd:", os.getcwd())
    print("APP_DIR:", APP_DIR)
    print("INDEX_HTML_PATH:", INDEX_HTML_PATH)
    print("Device:", device)
    print("Model find:", model_find_status)
    print("Model path:", found_model_path)
    print("Model status:", model_status)
    print("Open: http://127.0.0.1:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=True)