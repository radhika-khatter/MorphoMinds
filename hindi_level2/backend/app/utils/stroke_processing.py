import numpy as np

def normalize_strokes(strokes):
    """
    Normalize strokes to 0-1 scale
    """

    all_points = [
        (p["x"], p["y"])
        for stroke in strokes
        for p in stroke
    ]

    xs = [p[0] for p in all_points]
    ys = [p[1] for p in all_points]

    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    normalized = []

    for stroke in strokes:
        new_stroke = []
        for p in stroke:
            nx = (p["x"] - min_x) / (max_x - min_x + 1e-8)
            ny = (p["y"] - min_y) / (max_y - min_y + 1e-8)

            new_stroke.append({
                "x": nx,
                "y": ny,
                "t": p["t"]
            })
        normalized.append(new_stroke)

    return normalized