def signed_area(points):
    area = 0
    for i in range(len(points) - 1):
        x1, y1 = points[i]["x"], points[i]["y"]
        x2, y2 = points[i+1]["x"], points[i+1]["y"]
        area += (x2 - x1) * (y2 + y1)
    return area


def loop_direction_rule(strokes):
    """
    +1 → clockwise
    -1 → anticlockwise
    """
    loop = max(strokes, key=lambda s: len(s["points"]))
    return 1 if signed_area(loop["points"]) < 0 else -1
