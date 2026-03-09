# ============================
# English Trainer App (Stroke Templates + CNN Scan) - WEB CANVAS VERSION
# ✅ Uses your TRAINED 52-class model:
#    models_out_alphabet52/alphabet52_resnet18_best.pth
#    models_out_alphabet52/idx_to_label_52.json (optional)
#
# ✅ FIXED: Robust template loading + legacy JSON support
# - Works with template keys like: "lower:a", "upper:A", "a", "A", "lower_a", "upper-A", etc.
# - Works with values like: {"samples":[...]}, [...samples...], or single sample strokes
# - Normalizes samples on load for consistent stroke checking
#
# ✅ FIXED: BASE_DIR works in script + notebook + uvicorn
# ✅ Keeps templates saving to the same folder as this script (or CWD if __file__ missing)
# ============================

import json
import math
import os
from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional, Any

import numpy as np
from PIL import Image, ImageDraw

# ---- CNN (PyTorch) ----
try:
    import torch
    import torch.nn as nn
    from torchvision import models, transforms
except Exception:
    torch = None
    nn = None
    models = None
    transforms = None

# ---- WEB (FastAPI) ----
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn


# =============================================================================
# ✅ BASE DIR (robust)
# =============================================================================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
except NameError:
    BASE_DIR = os.getcwd()

def abs_path(*parts: str) -> str:
    return os.path.join(BASE_DIR, *parts)


# =============================================================================
# ✅ Safe JSON helpers
# =============================================================================
def safe_json_load(path: str) -> Any:
    if not os.path.exists(path):
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            txt = f.read().strip()
            if not txt:
                return {}
            return json.loads(txt)
    except Exception:
        return {}

def safe_json_dump(path: str, data: Any) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


# =============================================================================
# Utils: geometry / resampling
# =============================================================================
Point = Tuple[float, float]
Stroke = List[Point]
Strokes = List[Stroke]

def dist(a: Point, b: Point) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])

def polyline_length(pts: Stroke) -> float:
    if len(pts) < 2:
        return 0.0
    return sum(dist(pts[i - 1], pts[i]) for i in range(1, len(pts)))

def resample_stroke(pts: Stroke, n: int = 64) -> Stroke:
    """Resample stroke to exactly n points (evenly spaced along arc length)."""
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
    """Signed area proxy for stroke winding (useful for loops)."""
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


# =============================================================================
# ✅ Templates I/O (multi-sample) + backward-compatible loader
# =============================================================================
@dataclass
class TemplateSet:
    samples: List[Strokes]  # each sample is normalized strokes list (0..1)

    def to_dict(self) -> Dict:
        return {"samples": self.samples}

    @staticmethod
    def from_any(obj: Any) -> "TemplateSet":
        """
        Accepts:
        1) {"samples":[...]}                   ✅ new format
        2) [sample1, sample2, ...]             ✅ old: list of samples
        3) strokes (list of strokes)           ✅ old: single sample
        """
        if isinstance(obj, dict) and "samples" in obj:
            s = obj.get("samples", [])
            return TemplateSet(samples=s if isinstance(s, list) else [])

        if isinstance(obj, list):
            # Heuristic: if looks like strokes => single sample
            # strokes -> list of strokes -> stroke -> list of points -> [x,y]
            if len(obj) > 0 and isinstance(obj[0], list):
                if len(obj[0]) > 0 and isinstance(obj[0][0], (list, tuple)) and len(obj[0][0]) == 2:
                    # obj is strokes (single sample)
                    return TemplateSet(samples=[obj])
            # otherwise list of samples
            return TemplateSet(samples=obj)

        return TemplateSet(samples=[])

def _normalize_key(case_mode: str, letter: str) -> str:
    cm = (case_mode or "").strip().lower()
    if cm not in ("lower", "upper"):
        cm = "lower" if (letter and letter.islower()) else "upper"
    if cm == "lower":
        letter = (letter or "").lower()
    else:
        letter = (letter or "").upper()
    return f"{cm}:{letter}"

def template_key(letter: str, case_mode: str) -> str:
    return _normalize_key(case_mode, letter)

def load_template_sets(path: str) -> Dict[str, TemplateSet]:
    """
    Loads templates from disk and supports legacy key/value formats.
    Keys supported:
      - "lower:a", "upper:A"
      - "a", "A"
      - "lower_a", "upper-A", etc.
    Values supported:
      - {"samples":[...]}
      - [...samples...]
      - single strokes sample
    """
    data = safe_json_load(path)
    out: Dict[str, TemplateSet] = {}

    if not isinstance(data, dict):
        return out

    for raw_key, raw_val in data.items():
        k = str(raw_key)

        # normalize key
        if ":" in k:
            cm, lt = k.split(":", 1)
            nk = _normalize_key(cm, lt)
        elif "_" in k:
            cm, lt = k.split("_", 1)
            nk = _normalize_key(cm, lt)
        elif "-" in k:
            cm, lt = k.split("-", 1)
            nk = _normalize_key(cm, lt)
        else:
            lt = k.strip()
            cm = "lower" if lt.islower() else "upper"
            nk = _normalize_key(cm, lt)

        tset = TemplateSet.from_any(raw_val)

        # normalize all samples on load
        fixed_samples: List[Strokes] = []
        for sample in (tset.samples or []):
            try:
                fixed_samples.append(normalize_strokes(sample))
            except Exception:
                continue

        if nk not in out:
            out[nk] = TemplateSet(samples=[])
        out[nk].samples.extend(fixed_samples)

    return out

def save_template_sets(path: str, templates: Dict[str, TemplateSet]) -> None:
    data = {k: t.to_dict() for k, t in templates.items()}
    safe_json_dump(path, data)

def _find_templates_for_letter(templates: Dict[str, TemplateSet], case_mode: str, letter: str) -> Optional[TemplateSet]:
    """
    Find template set even if JSON uses legacy keys.
    """
    k1 = template_key(letter, case_mode)
    if k1 in templates and templates[k1].samples:
        return templates[k1]

    cm = (case_mode or "").lower()
    l_only = (letter.lower() if cm == "lower" else letter.upper())

    # check legacy keys if present (rare after load migration, but safe)
    for kk in (l_only, f"{cm}_{l_only}", f"{cm}-{l_only}"):
        if kk in templates and templates[kk].samples:
            templates[k1] = templates[kk]
            return templates[kk]

    return None


# =============================================================================
# CNN MODEL LOADER (YOUR TRAINED ResNet18 52-class)
# =============================================================================
def build_resnet18(num_classes: int):
    m = models.resnet18(weights=None)
    m.fc = nn.Linear(m.fc.in_features, num_classes)
    return m

def load_alphabet52_model(model_path: str, device: str, map_path: Optional[str] = None):
    if torch is None or models is None or transforms is None or nn is None:
        return None, None, "PyTorch/torchvision not available"

    if not os.path.exists(model_path):
        return None, None, f"Model not found: {model_path}"

    ckpt = torch.load(model_path, map_location=device)

    num_classes = None
    idx_to_label = None
    img_size = 96

    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        num_classes = int(ckpt.get("num_classes", 52))
        idx_to_label = ckpt.get("idx_to_label", None)
        state_dict = ckpt["state_dict"]
        img_size = int(ckpt.get("img_size", 96))
    else:
        num_classes = 52
        state_dict = ckpt
        img_size = 96

    if idx_to_label is None and map_path and os.path.exists(map_path):
        try:
            with open(map_path, "r", encoding="utf-8") as f:
                idx_to_label = json.load(f)
        except Exception:
            idx_to_label = None

    if idx_to_label is None:
        idx_to_label = [chr(ord("A") + i) for i in range(26)] + [chr(ord("a") + i) for i in range(26)]

    model = build_resnet18(num_classes=num_classes).to(device)
    model.load_state_dict(state_dict, strict=False)
    model.eval()

    status = f"Loaded ResNet18 ({num_classes} classes), img_size={img_size}"
    return model, {"idx_to_label": idx_to_label, "img_size": img_size}, status


# =============================================================================
# Render strokes -> model tensor
# =============================================================================
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

def strokes_to_model_pil(strokes: Strokes, canvas_size: int, thickness: int = 14) -> Optional[Image.Image]:
    img = Image.new("L", (canvas_size, canvas_size), 255)
    draw = ImageDraw.Draw(img)

    for s in strokes:
        if len(s) < 2:
            continue
        for i in range(1, len(s)):
            draw.line([s[i - 1], s[i]], fill=0, width=thickness)

    arr = np.array(img)
    ys, xs = np.where(arr < 250)
    if len(xs) == 0 or len(ys) == 0:
        return None

    minx, maxx = xs.min(), xs.max()
    miny, maxy = ys.min(), ys.max()
    pad = 20
    minx = max(minx - pad, 0)
    miny = max(miny - pad, 0)
    maxx = min(maxx + pad, canvas_size - 1)
    maxy = min(maxy + pad, canvas_size - 1)

    cropped = img.crop((minx, miny, maxx + 1, maxy + 1))

    w, h = cropped.size
    s = max(w, h)
    sq = Image.new("L", (s, s), 255)
    sq.paste(cropped, ((s - w) // 2, (s - h) // 2))
    return sq

def pil_to_model_tensor(pil_L: Image.Image, img_size: int, device: str):
    tfm = transforms.Compose([
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    x = tfm(pil_L).unsqueeze(0)
    return x.to(device)


# =============================================================================
# Stroke validation
# =============================================================================
@dataclass
class StrokeCheckResult:
    ok: bool
    per_stroke_ok: List[bool]
    messages: List[str]
    score: float

def validate_strokes(
    user: Strokes,
    tmpl_strokes: Strokes,
    direction_deg_tol: float = 55.0,
    shape_mean_dist_tol: float = 0.20,
    require_same_count: bool = True,
) -> StrokeCheckResult:
    msgs: List[str] = []

    user_count = len(user)
    tmpl_count = len(tmpl_strokes)

    if require_same_count and user_count != tmpl_count:
        msgs.append(f"Stroke count wrong: you used {user_count}, expected {tmpl_count}.")

    n = min(user_count, tmpl_count)
    if n == 0:
        return StrokeCheckResult(False, [], ["No strokes to compare."], score=-999)

    user_n = normalize_strokes(user)
    tmpl_n = tmpl_strokes

    per_ok: List[bool] = []
    all_ok = True
    dist_acc = 0.0

    for i in range(n):
        us = resample_stroke(user_n[i], 64)
        ts = resample_stroke(tmpl_n[i], 64)

        ang = angle_between(stroke_direction_vec(us), stroke_direction_vec(ts))
        dir_ok = ang <= direction_deg_tol

        md = mean_point_distance(us, ts)
        dist_acc += md
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
            bits = []
            if not dir_ok:
                bits.append(f"direction off ({ang:.0f}°)")
            if not winding_ok:
                bits.append("loop direction reversed")
            if not shape_ok:
                bits.append(f"shape mismatch ({md:.2f})")
            msgs.append(f"Stroke {i+1} wrong: " + ", ".join(bits))

    if require_same_count and user_count != tmpl_count:
        all_ok = False

    if all_ok and not msgs:
        msgs.append("Strokes look correct ✅")

    avg_dist = dist_acc / max(1, n)
    score = float(sum(1 for x in per_ok if x)) - (avg_dist * 2.0)
    if require_same_count and user_count != tmpl_count:
        score -= 1.0

    return StrokeCheckResult(all_ok, per_ok, msgs, score)

def validate_against_templateset(
    user: Strokes,
    tset: TemplateSet,
    direction_deg_tol: float,
    shape_mean_dist_tol: float,
    require_same_count: bool,
) -> StrokeCheckResult:
    if not tset.samples:
        return StrokeCheckResult(False, [], ["No template samples found."], score=-999)

    best: Optional[StrokeCheckResult] = None
    for sample in tset.samples:
        r = validate_strokes(user, sample, direction_deg_tol, shape_mean_dist_tol, require_same_count)
        if best is None or r.score > best.score:
            best = r
    return best if best is not None else StrokeCheckResult(False, [], ["No template matched."], score=-999)


# =============================================================================
# App Core
# =============================================================================
class EnglishTrainerCore:
    def __init__(
        self,
        model_path: str,
        map_path: str,
        templates_path: str,
        canvas_size: int = 420
    ):
        self.model_path = model_path
        self.map_path = map_path
        self.templates_path = templates_path
        self.canvas_size = canvas_size

        # Load templates (robust)
        self.templates: Dict[str, TemplateSet] = load_template_sets(self.templates_path)

        self.device = "cuda" if (torch and torch.cuda.is_available()) else "cpu"
        self.model, self.model_meta, self.model_status = load_alphabet52_model(
            self.model_path, self.device, map_path=self.map_path
        )
        if self.model_meta is None:
            self.model_meta = {
                "idx_to_label": [chr(ord("A") + i) for i in range(26)] + [chr(ord("a") + i) for i in range(26)],
                "img_size": 96
            }

        self.direction_tol = 60.0
        self.shape_tol = 0.22

    def run_cnn(self, strokes: Strokes) -> Tuple[Optional[str], Optional[float], str, Optional[List[Tuple[str, float]]]]:
        if self.model is None:
            return None, None, "CNN not loaded.", None
        if not strokes:
            return None, None, "No drawing to scan.", None

        pil_sq = strokes_to_model_pil(strokes, self.canvas_size, thickness=14)
        if pil_sq is None:
            return None, None, "Nothing to scan (blank).", None

        img_size = int(self.model_meta.get("img_size", 96))
        x = pil_to_model_tensor(pil_sq, img_size=img_size, device=self.device)

        with torch.no_grad():
            logits = self.model(x)
            probs = torch.softmax(logits, dim=1)[0]
            idx = int(torch.argmax(probs).item())
            conf = float(probs[idx].item())
            topk = torch.topk(probs, k=min(3, probs.numel()))
            idxs = topk.indices.cpu().numpy().tolist()
            vals = topk.values.cpu().numpy().tolist()

        idx_to_label = self.model_meta["idx_to_label"]
        pred = idx_to_label[idx] if 0 <= idx < len(idx_to_label) else "?"
        top3 = []
        for ii, vv in zip(idxs, vals):
            lab = idx_to_label[ii] if 0 <= ii < len(idx_to_label) else "?"
            top3.append((lab, float(vv)))

        return pred, conf, "ok", top3

    def save_template(self, strokes: Strokes, letter: str, case_mode: str) -> Dict[str, Any]:
        key = template_key(letter, case_mode)

        if not strokes:
            return {"ok": False, "message": "Nothing to save. Draw first."}

        norm = normalize_strokes(strokes)
        if key not in self.templates:
            self.templates[key] = TemplateSet(samples=[])

        self.templates[key].samples.append(norm)
        save_template_sets(self.templates_path, self.templates)

        return {
            "ok": True,
            "message": f"Saved template sample for {case_mode} '{letter}' ✅ (total samples: {len(self.templates[key].samples)})",
            "count": len(self.templates[key].samples),
            "templates_path": self.templates_path,
            "saved_key": key
        }

    def check_all(self, strokes: Strokes, letter: str, case_mode: str) -> Dict[str, Any]:
        key = template_key(letter, case_mode)

        # ✅ robust template find (handles pretrained/legacy json)
        tset = _find_templates_for_letter(self.templates, case_mode, letter)

        if (tset is None) or (not tset.samples):
            pred, conf, _, top3 = self.run_cnn(strokes)
            return {
                "has_template": False,
                "template_messages": [
                    f"No template for {case_mode} '{letter}'. (Looked for key: {key})",
                    "If you already have a pretrained JSON, make sure it's saved at the shown Templates path.",
                ],
                "per_stroke_ok": [],
                "cnn": {"pred": pred, "conf": conf, "top3": top3, "correct": (pred == letter if pred else False)},
                "device": self.device,
                "model_status": self.model_status,
                "templates_path": self.templates_path,
                "loaded_template_keys_count": len(self.templates),
                "expected_key": key
            }

        template_result = validate_against_templateset(
            strokes,
            tset,
            direction_deg_tol=self.direction_tol,
            shape_mean_dist_tol=self.shape_tol,
            require_same_count=True
        )

        pred, conf, _, top3 = self.run_cnn(strokes)
        ok_letter = (pred == letter) if pred is not None else False

        return {
            "has_template": True,
            "template_messages": template_result.messages,
            "per_stroke_ok": template_result.per_stroke_ok,
            "template_samples": len(tset.samples),
            "cnn": {"pred": pred, "conf": conf, "top3": top3, "correct": ok_letter},
            "device": self.device,
            "model_status": self.model_status,
            "templates_path": self.templates_path,
            "expected_key": key
        }


# =============================================================================
# Web API
# =============================================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
MODEL_PATH = abs_path("models_out_alphabet52", "alphabet52_resnet18_best.pth")
MAP_PATH   = abs_path("models_out_alphabet52", "idx_to_label_52.json")
TEMPLATES_PATH = abs_path("letter_templates.json")  # ✅ ALWAYS SAVES HERE

core = EnglishTrainerCore(
    model_path=MODEL_PATH,
    map_path=MAP_PATH,
    templates_path=TEMPLATES_PATH,
    canvas_size=420
)

class StrokePayload(BaseModel):
    case_mode: str
    letter: str
    strokes: List[List[List[float]]]

def _payload_to_strokes(payload_strokes: List[List[List[float]]]) -> Strokes:
    out: Strokes = []
    for s in payload_strokes:
        stroke: Stroke = []
        for p in s:
            if not isinstance(p, list) or len(p) != 2:
                continue
            stroke.append((float(p[0]), float(p[1])))
        if stroke:
            out.append(stroke)
    return out


@app.get("/", response_class=HTMLResponse)
def index():
    html = f"""
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>English Trainer (Canvas + CNN)</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 18px; }}
    .row {{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; }}
    .panel {{ margin-top: 12px; }}
    canvas {{ border:1px solid #ddd; background:#fff; border-radius:10px; touch-action:none; }}
    button, select {{ padding:10px 12px; border-radius:10px; border:1px solid #ccc; background:#fafafa; cursor:pointer; }}
    #msg {{ white-space: pre-wrap; padding:12px; border-radius:12px; background:#f7f7f7; border:1px solid #eee; }}
    .tag {{ padding:6px 10px; border-radius:999px; background:#111; color:#fff; font-size:12px; }}
    .small {{ font-size: 12px; color:#555; }}
  </style>
</head>
<body>
  <div class="row">
    <div class="tag">Device: {core.device}</div>
    <div class="tag">{core.model_status}</div>
    <div class="tag">Templates: {core.templates_path}</div>
    <div class="tag">Loaded keys: {len(core.templates)}</div>
  </div>

  <div class="panel row">
    <label>Case:</label>
    <select id="caseMode">
      <option value="lower" selected>Lower</option>
      <option value="upper">Upper</option>
    </select>

    <label>Target:</label>
    <select id="letter"></select>

    <button id="undoBtn">Undo</button>
    <button id="clearBtn">Clear</button>
    <button id="checkBtn">Check (Strokes + CNN)</button>
    <button id="saveBtn">Save Template (Add Sample)</button>
    <button id="downloadBtn">Download Templates JSON</button>
  </div>

  <div class="panel">
    <canvas id="pad" width="420" height="420"></canvas>
    <div class="small">Draw with mouse or touch. Each press = one stroke.</div>
  </div>

  <div class="panel">
    <div id="msg">Draw the letter, then click Check. If no template exists, Save Template first.</div>
  </div>

<script>
const canvas = document.getElementById("pad");
const ctx = canvas.getContext("2d");

let strokes = [];
let current = null;
let drawing = false;

function setStyle(color="black") {{
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
}}

function redraw(perStrokeOk=null) {{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i=0;i<strokes.length;i++) {{
    const s = strokes[i];
    const ok = perStrokeOk ? perStrokeOk[i] : null;
    const color = ok === null ? "black" : (ok ? "green" : "red");
    setStyle(color);
    ctx.beginPath();
    for (let j=0;j<s.length;j++) {{
      const [x,y]=s[j];
      if (j===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }}
    ctx.stroke();
  }}
}}

function getPos(e) {{
  const r = canvas.getBoundingClientRect();
  const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
  return [clientX - r.left, clientY - r.top];
}}

function startDraw(e) {{
  e.preventDefault();
  drawing = true;
  current = [];
  const [x,y]=getPos(e);
  current.push([x,y]);
}}

function moveDraw(e) {{
  if (!drawing || !current) return;
  e.preventDefault();
  const [x,y]=getPos(e);
  const last = current[current.length-1];
  current.push([x,y]);
  setStyle("black");
  ctx.beginPath();
  ctx.moveTo(last[0], last[1]);
  ctx.lineTo(x,y);
  ctx.stroke();
}}

function endDraw(e) {{
  if (!drawing) return;
  drawing = false;
  if (current && current.length > 1) strokes.push(current);
  current = null;
}}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", moveDraw);
window.addEventListener("mouseup", endDraw);

canvas.addEventListener("touchstart", startDraw, {{passive:false}});
canvas.addEventListener("touchmove", moveDraw, {{passive:false}});
window.addEventListener("touchend", endDraw);

const msg = document.getElementById("msg");
const caseMode = document.getElementById("caseMode");
const letterSel = document.getElementById("letter");

function lettersFor(mode) {{
  const out = [];
  if (mode === "upper") for (let i=0;i<26;i++) out.push(String.fromCharCode("A".charCodeAt(0)+i));
  else for (let i=0;i<26;i++) out.push(String.fromCharCode("a".charCodeAt(0)+i));
  return out;
}}

function refreshLetters() {{
  const vals = lettersFor(caseMode.value);
  letterSel.innerHTML = "";
  for (const v of vals) {{
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = v;
    letterSel.appendChild(opt);
  }}
  letterSel.value = (caseMode.value === "upper") ? "A" : "a";
}}

caseMode.addEventListener("change", () => {{
  refreshLetters();
  strokes = [];
  redraw();
  msg.textContent = `Case changed to ${{
    caseMode.value
  }}. Cleared.`;
}});

refreshLetters();

document.getElementById("clearBtn").addEventListener("click", () => {{
  strokes = [];
  redraw();
  msg.textContent = "Cleared. Draw again.";
}});

document.getElementById("undoBtn").addEventListener("click", () => {{
  if (strokes.length === 0) return;
  strokes.pop();
  redraw();
  msg.textContent = "Undid last stroke. Continue drawing.";
}});

async function postJSON(url, body) {{
  const res = await fetch(url, {{
    method: "POST",
    headers: {{ "Content-Type": "application/json" }},
    body: JSON.stringify(body)
  }});
  return await res.json();
}}

document.getElementById("saveBtn").addEventListener("click", async () => {{
  if (strokes.length === 0) {{
    msg.textContent = "Nothing to save. Draw first.";
    return;
  }}
  const body = {{ case_mode: caseMode.value, letter: letterSel.value, strokes }};
  const data = await postJSON("/api/save_template", body);
  msg.textContent = (data.message || "Saved.") + "\\nSaved at: " + (data.templates_path || "") + "\\nKey: " + (data.saved_key || "");
}});

document.getElementById("checkBtn").addEventListener("click", async () => {{
  if (strokes.length === 0) {{
    msg.textContent = "No drawing to check.";
    return;
  }}
  const body = {{ case_mode: caseMode.value, letter: letterSel.value, strokes }};
  const data = await postJSON("/api/check_all", body);

  if (data.per_stroke_ok && data.per_stroke_ok.length) redraw(data.per_stroke_ok);
  else redraw(null);

  let text = "";
  if (data.template_messages && data.template_messages.length) text += data.template_messages.join("\\n");

  if (data.cnn && data.cnn.pred != null) {{
    const c = data.cnn.conf != null ? data.cnn.conf.toFixed(2) : "?";
    const ok = data.cnn.correct ? "Correct ✅" : "Wrong ❌";
    text += `\\n\\nCNN predicts: ${{
      data.cnn.pred
    }} (conf ${{
      c
    }}) → ${{
      ok
    }}`;
    if (data.cnn.top3 && data.cnn.top3.length) {{
      const t3 = data.cnn.top3.map(x => `${{x[0]}}:${{(x[1]).toFixed(2)}}`).join(" | ");
      text += `\\nTop-3: ${{t3}}`;
    }}
  }}

  if (data.template_samples != null) text += `\\n\\nTemplate samples for this letter: ${{data.template_samples}}`;
  if (data.expected_key) text += `\\nExpected key: ${{data.expected_key}}`;
  if (data.templates_path) text += `\\nSaved at: ${{data.templates_path}}`;
  if (data.loaded_template_keys_count != null) text += `\\nLoaded keys: ${{data.loaded_template_keys_count}}`;

  msg.textContent = text.trim() || "Done.";
}});

document.getElementById("downloadBtn").addEventListener("click", () => {{
  window.open("/download/templates", "_blank");
}});
</script>
</body>
</html>
"""
    return HTMLResponse(content=html)


@app.post("/api/save_template")
def api_save_template(payload: StrokePayload):
    strokes = _payload_to_strokes(payload.strokes)
    out = core.save_template(strokes, payload.letter, payload.case_mode)
    return JSONResponse(out)


@app.post("/api/check_all")
def api_check_all(payload: StrokePayload):
    strokes = _payload_to_strokes(payload.strokes)
    out = core.check_all(strokes, payload.letter, payload.case_mode)
    return JSONResponse(out)


@app.get("/download/templates")
def download_templates():
    if not os.path.exists(core.templates_path):
        safe_json_dump(core.templates_path, {})
    return FileResponse(core.templates_path, filename="letter_templates.json")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8003)