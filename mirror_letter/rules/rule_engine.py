from rules.stroke_order import stroke_order_rule
from rules.loop_side import loop_side_rule
from rules.stroke_direction import loop_direction_rule


def apply_rules(letter_hint, strokes):
    results = {}

    results["stroke_order_ok"] = stroke_order_rule(letter_hint, strokes)
    results["loop_side"] = loop_side_rule(strokes)
    results["direction"] = loop_direction_rule(strokes)

    # Confidence heuristic
    score = 0
    score += 0.4 if results["stroke_order_ok"] else 0
    score += 0.4 if (
        (letter_hint == "b" and results["loop_side"] == 1) or
        (letter_hint == "d" and results["loop_side"] == -1)
    ) else 0
    score += 0.2 if results["direction"] == 1 else 0

    results["rule_confidence"] = score
    return results
