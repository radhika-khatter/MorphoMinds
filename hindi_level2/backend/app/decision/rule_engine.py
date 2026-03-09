import numpy as np
from app.decision.expected_config import EXPECTED_CONFIG

# =====================================================
# Stroke Classification
# =====================================================

def classify_stroke(stroke):

    xs = [p["x"] for p in stroke]
    ys = [p["y"] for p in stroke]

    dx = max(xs) - min(xs)
    dy = max(ys) - min(ys)

    if dx < 1e-5 and dy < 1e-5:
        return "dot"

    # ------------------------------------------------
    # 1️⃣ Check deviation from straight line
    # ------------------------------------------------

    start = stroke[0]
    end = stroke[-1]

    x1, y1 = start["x"], start["y"]
    x2, y2 = end["x"], end["y"]

    # Line equation parameters
    A = y2 - y1
    B = x1 - x2
    C = x2*y1 - x1*y2

    total_deviation = 0

    for p in stroke:
        x0, y0 = p["x"], p["y"]

        # Distance from line
        distance = abs(A*x0 + B*y0 + C) / ( (A*A + B*B)**0.5 + 1e-8 )
        total_deviation += distance

    avg_deviation = total_deviation / len(stroke)

    # 🔥 If deviation high → curve
    if avg_deviation > 2:   # You can tune this threshold
        return "curve"

    # ------------------------------------------------
    # 2️⃣ If mostly straight → check orientation
    # ------------------------------------------------

    ratio = dy / (dx + 1e-8)

    if ratio > 2:
        return "vertical"
    elif ratio < 0.5:
        return "horizontal"
    else:
        return "curve"


def get_direction(stroke):
    start = stroke[0]
    end = stroke[-1]

    dx = end["x"] - start["x"]
    dy = end["y"] - start["y"]

    if abs(dx) > abs(dy):
        return "left_to_right" if dx > 0 else "right_to_left"
    else:
        return "top_to_bottom" if dy > 0 else "bottom_to_top"


# =====================================================
# Human Friendly Conversions
# =====================================================

def human_type_name(stroke_type):
    mapping = {
        "vertical": "a standing vertical line",
        "horizontal": "a sleeping horizontal line",
        "curve": "a curved stroke"
    }
    return mapping.get(stroke_type, stroke_type)


def human_direction(direction):
    mapping = {
        "top_to_bottom": "from top to bottom",
        "bottom_to_top": "from bottom to top",
        "left_to_right": "from left to right",
        "right_to_left": "from right to left"
    }
    return mapping.get(direction, direction)


# =====================================================
# Rule Engine
# =====================================================

# =====================================================
# Rule Engine
# =====================================================

def evaluate_rules(letter, strokes):

    # -------------------------------------------------
    # 0️⃣ Get Configuration From expected_config.py
    # -------------------------------------------------

    if letter not in EXPECTED_CONFIG:
        return {"error": f"Letter '{letter}' not configured in system."}

    config = EXPECTED_CONFIG[letter]

    feedback = []
    score = 0
    max_score = 0

    type_errors = []
    direction_errors = []
    shirorekha_error = False

    expected_count = config["stroke_count"]

    # =====================================================
    # 1️⃣ Stroke Count Check
    # =====================================================
    max_score += 1

    if len(strokes) != expected_count:
        feedback.append(
            f"This letter needs {expected_count} strokes, but you drew {len(strokes)}."
        )
    else:
        feedback.append("Good job! You used the correct number of strokes.")
        score += 1

    # Stop further validation if stroke count wrong
    if len(strokes) != expected_count:
        overall_score = int((score / max_score) * 100)
        return {
            "letter": letter,
            "overall_score": overall_score,
            "feedback": feedback,
            "errors": {
                "type_errors": [],
                "direction_errors": [],
                "shirorekha_error": False
            }
        }

    # =====================================================
    # 2️⃣ Stroke Type + Order Validation
    # =====================================================

    for i, expected_stroke in enumerate(config["strokes"]):

        expected_type = expected_stroke["type"]
        expected_direction = expected_stroke["direction"]

        actual_type = classify_stroke(strokes[i])

        # --- Type Check ---
        max_score += 1

        if actual_type == expected_type:
            feedback.append(
                f"Stroke {i+1} is correctly drawn as {human_type_name(expected_type)}."
            )
            score += 1
        else:
            type_errors.append(i)
            feedback.append(
                f"Stroke {i+1} should be {human_type_name(expected_type)}, "
                f"but you drew {human_type_name(actual_type)}."
            )

        # --- Direction Check ---
        if expected_direction is not None:

            max_score += 1
            actual_direction = get_direction(strokes[i])

            if actual_direction == expected_direction:
                feedback.append(
                    f"Stroke {i+1} is correctly drawn {human_direction(actual_direction)}."
                )
                score += 1
            else:
                direction_errors.append(i)
                feedback.append(
                    f"Stroke {i+1} should go {human_direction(expected_direction)}, "
                    f"but you drew it {human_direction(actual_direction)}."
                )

    # =====================================================
    # 3️⃣ Shirorekha Rule (If Enabled)
    # =====================================================

    if config["rules"].get("shirorekha_last", False):

        max_score += 1
        last_type = classify_stroke(strokes[-1])

        if last_type == "horizontal":
            feedback.append("Great! You drew the top horizontal line at the end.")
            score += 1
        else:
            shirorekha_error = True
            feedback.append(
                "The top horizontal line (shirorekha) should be drawn at the end."
            )

    # =====================================================
    # Final Score
    # =====================================================

    overall_score = int((score / max_score) * 100) if max_score > 0 else 0

    return {
        "letter": letter,
        "overall_score": overall_score,
        "feedback": feedback,
        "errors": {
            "type_errors": type_errors,
            "direction_errors": direction_errors,
            "shirorekha_error": shirorekha_error
        }
    }