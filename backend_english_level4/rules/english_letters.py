from .base import (
    stroke_count,
    stroke_order_rule,
    loop_side_rule,
    loop_direction_rule,
)

# --------------------------------------------------------
# Letter: b
# Line first, loop on RIGHT, clockwise loop
# --------------------------------------------------------

def rule_b(strokes):
    score = 100
    reasons = []

    if stroke_count(strokes) != 2:
        score -= 40
        reasons.append("b requires exactly 2 strokes")

    if not stroke_order_rule("b", strokes):
        score -= 20
        reasons.append("Stroke order incorrect (b should start with vertical line)")

    if loop_side_rule(strokes) != 1:
        score -= 40
        reasons.append("Loop is on wrong side (looks like d)")

    if loop_direction_rule(strokes) != 1:
        score -= 10
        reasons.append("Loop direction incorrect")

    return max(score, 0), reasons


# --------------------------------------------------------
# Letter: d
# Curve first, loop on LEFT, anticlockwise loop
# --------------------------------------------------------

def rule_d(strokes):
    score = 100
    reasons = []

    if stroke_count(strokes) != 2:
        score -= 40
        reasons.append("d requires exactly 2 strokes")

    if not stroke_order_rule("d", strokes):
        score -= 20
        reasons.append("Stroke order incorrect (d should start with loop)")

    if loop_side_rule(strokes) != -1:
        score -= 40
        reasons.append("Loop is on wrong side (looks like b)")

    if loop_direction_rule(strokes) != -1:
        score -= 10
        reasons.append("Loop direction incorrect")

    return max(score, 0), reasons


# --------------------------------------------------------
# Letter: p
# Line first, loop on RIGHT
# --------------------------------------------------------

def rule_p(strokes):
    score = 100
    reasons = []

    if stroke_count(strokes) != 2:
        score -= 40
        reasons.append("p requires exactly 2 strokes")

    if not stroke_order_rule("p", strokes):
        score -= 20
        reasons.append("Stroke order incorrect (p should start with vertical line)")

    if loop_side_rule(strokes) != 1:
        score -= 40
        reasons.append("Loop is on wrong side (looks like q)")

    # Optional direction rule if needed
    # if loop_direction_rule(strokes) != 1:
    #     score -= 10
    #     reasons.append("Loop direction incorrect")

    return max(score, 0), reasons


# --------------------------------------------------------
# Letter: q
# Curve first, loop on LEFT
# --------------------------------------------------------

def rule_q(strokes):
    score = 100
    reasons = []

    if stroke_count(strokes) != 2:
        score -= 40
        reasons.append("q requires exactly 2 strokes")

    if not stroke_order_rule("q", strokes):
        score -= 20
        reasons.append("Stroke order incorrect (q should start with loop)")

    if loop_side_rule(strokes) != -1:
        score -= 40
        reasons.append("Loop is on wrong side (looks like p)")

    # Optional direction rule
    # if loop_direction_rule(strokes) != -1:
    #     score -= 10
    #     reasons.append("Loop direction incorrect")

    return max(score, 0), reasons


# --------------------------------------------------------
# Registry
# --------------------------------------------------------

ENGLISH_RULE_FUNCTIONS = {
    "b": rule_b,
    "d": rule_d,
    "p": rule_p,
    "q": rule_q,
}