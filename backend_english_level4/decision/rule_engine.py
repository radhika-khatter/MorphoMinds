import json
import os

from backend_english_level4.rules.english_letters import ENGLISH_RULE_FUNCTIONS

# =====================================================
# 🔹 Load Stroke Metadata (Only Once)
# =====================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RULES_PATH = os.path.join(BASE_DIR, "rules", "metadata", "stroke_rules.json")

with open(RULES_PATH, "r") as f:
    STROKE_RULES = json.load(f)


# =====================================================
# 🔹 Stroke Count Validator (For 48 Letters)
# =====================================================

def validate_stroke_count(letter, strokes):
    count = len(strokes)

    if letter not in STROKE_RULES:
        return 0, ["No stroke metadata found"]

    rule = STROKE_RULES[letter]
    min_s = rule["min_strokes"]
    max_s = rule["max_strokes"]

    if min_s <= count <= max_s:
        return 80, ["Stroke count valid"]
    else:
        return 40, [
            f"Invalid stroke count: expected {min_s}-{max_s}, got {count}"
        ]


# =====================================================
# 🔹 Main Rule Evaluator
# =====================================================

def evaluate_rules(target, strokes):
    print("\n===== RULE ENGINE DEBUG =====")
    print("Target letter:", target)
    print("Number of strokes received:", len(strokes))

    for i, stroke in enumerate(strokes):
        print(f"Stroke {i+1} length:", len(stroke))

    print("=============================")

    # -------------------------------------------------
    # 1️⃣ Apply Full Structural Rules (b, d, p, q)
    # -------------------------------------------------
    if target in ENGLISH_RULE_FUNCTIONS:
        score, reasons = ENGLISH_RULE_FUNCTIONS[target](strokes)

        print("English structural rule applied")
        print("Score:", score)
        print("Reasons:", reasons)
        print("=============================\n")

        return {
            "status": "correct" if score >= 70 else "wrong",
            "score": score,
            "reasons": reasons,
            "engine": "rules"
        }

    # -------------------------------------------------
    # 2️⃣ Stroke Count Validation (Remaining 48 Letters)
    # -------------------------------------------------
    score, reasons = validate_stroke_count(target, strokes)

    print("Stroke count rule applied")
    print("Score:", score)
    print("Reasons:", reasons)
    print("=============================\n")

    return {
        "status": "correct" if score >= 70 else "wrong",
        "score": score,
        "reasons": reasons,
        "engine": "rules"
    }