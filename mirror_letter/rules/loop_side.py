def compute_centroid(points):
    x = sum(p["x"] for p in points) / len(points)
    y = sum(p["y"] for p in points) / len(points)
    return x, y


def loop_side_rule(strokes):
    """
    Returns:
    +1 → loop on right
    -1 → loop on left
    """
    stem = max(strokes, key=lambda s: abs(
        max(p["y"] for p in s["points"]) -
        min(p["y"] for p in s["points"])
    ))

    loop = min(strokes, key=lambda s: abs(
        max(p["y"] for p in s["points"]) -
        min(p["y"] for p in s["points"])
    ))

    stem_x, _ = compute_centroid(stem["points"])
    loop_x, _ = compute_centroid(loop["points"])

    return 1 if loop_x > stem_x else -1
