def stroke_count(strokes):
    return len(strokes)


def stroke_start(stroke):
    return stroke[0].x, stroke[0].y


def stroke_end(stroke):
    return stroke[-1].x, stroke[-1].y


def direction(stroke):
    dx = stroke[-1].x - stroke[0].x
    dy = stroke[-1].y - stroke[0].y
    return dx, dy


def is_vertical(stroke, threshold=0.1):
    dx, dy = direction(stroke)
    return abs(dx) < threshold and abs(dy) > threshold


def is_horizontal(stroke, threshold=0.1):
    dx, dy = direction(stroke)
    return abs(dy) < threshold and abs(dx) > threshold


def is_left_to_right(stroke):
    dx, _ = direction(stroke)
    return dx > 0


def is_top_to_bottom(stroke):
    _, dy = direction(stroke)
    return dy > 0


def get_center_x(stroke):
    xs = [point.x for point in stroke]
    return sum(xs) / len(xs)

def get_center_y(stroke):
    ys = [point.y for point in stroke]
    return sum(ys) / len(ys)

def get_min_x(stroke):
    return min(point.x for point in stroke)

def get_max_x(stroke):
    return max(point.x for point in stroke)

def get_min_y(stroke):
    return min(point.y for point in stroke)

def get_max_y(stroke):
    return max(point.y for point in stroke)

def compute_centroid(stroke):
    x = sum(p.x for p in stroke) / len(stroke)
    y = sum(p.y for p in stroke) / len(stroke)
    return x, y


def loop_side_rule(strokes):
    """
    +1 → loop on right
    -1 → loop on left
    """

    # Stem = stroke with largest vertical span
    stem = max(
        strokes,
        key=lambda s: max(p.y for p in s) - min(p.y for p in s)
    )

    # Loop = stroke with smallest vertical span
    loop = min(
        strokes,
        key=lambda s: max(p.y for p in s) - min(p.y for p in s)
    )

    stem_x, _ = compute_centroid(stem)
    loop_x, _ = compute_centroid(loop)

    return 1 if loop_x > stem_x else -1


def get_first_stroke_type(strokes):
    first = strokes[0]

    xs = [p.x for p in first]
    ys = [p.y for p in first]

    x_var = max(xs) - min(xs)
    y_var = max(ys) - min(ys)

    if x_var < y_var * 0.3:
        return "line"
    return "curve"


def stroke_order_rule(letter_hint, strokes):
    first_type = get_first_stroke_type(strokes)

    if letter_hint in ["b", "p"]:
        return first_type == "line"

    if letter_hint in ["d", "q"]:
        return first_type == "curve"

    return None


def signed_area(stroke):
    area = 0
    for i in range(len(stroke) - 1):
        x1, y1 = stroke[i].x, stroke[i].y
        x2, y2 = stroke[i+1].x, stroke[i+1].y
        area += (x2 - x1) * (y2 + y1)
    return area


def loop_direction_rule(strokes):
    """
    +1 → clockwise
    -1 → anticlockwise
    """
    loop = max(strokes, key=lambda s: len(s))
    return 1 if signed_area(loop) < 0 else -1