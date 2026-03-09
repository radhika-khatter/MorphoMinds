import json
from pathlib import Path

BASE_PATH = Path(__file__).parent / "metadata"

def load_rules(filename):
    with open(BASE_PATH / filename) as f:
        return json.load(f)

MIRROR_RULES = load_rules("mirror_letters.json")
MULTI_STROKE_RULES = load_rules("multi_stroke_letters.json")
SHAPE_RULES = load_rules("shape_dominant_letters.json")
SIMPLE_RULES = load_rules("simple_letters.json")
FALLBACK_RULES = load_rules("fallback_letters.json")
