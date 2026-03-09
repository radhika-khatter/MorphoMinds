def get_first_stroke_type(strokes):
    """
    Returns: 'line' or 'curve'
    """
    first = strokes[0]["points"]

    xs = [p["x"] for p in first]
    ys = [p["y"] for p in first]

    x_var = max(xs) - min(xs)
    y_var = max(ys) - min(ys)

    # Vertical line heuristic
    if x_var < y_var * 0.3:
        return "line"
    return "curve"


def stroke_order_rule(letter_hint, strokes):
    """
    letter_hint: 'b', 'd', 'p', 'q'
    """
    first_type = get_first_stroke_type(strokes)

    if letter_hint in ["b", "p"]:
        return first_type == "line"
    if letter_hint in ["d", "q"]:
        return first_type == "curve"

    return None
