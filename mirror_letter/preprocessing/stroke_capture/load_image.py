import base64
import io
import numpy as np
from PIL import Image


def load_image_from_frontend(image_base64: str) -> np.ndarray:
    """
    Convert Base64 PNG image from frontend into a NumPy array.

    Input:
        image_base64 (str): "data:image/png;base64,...."

    Output:
        img_np (np.ndarray): shape (28, 28), dtype uint8
    """

    if "," not in image_base64:
        raise ValueError("Invalid Base64 image format")

    # 1️⃣ Strip header
    _, encoded = image_base64.split(",", 1)

    # 2️⃣ Decode Base64 → bytes
    image_bytes = base64.b64decode(encoded)

    # 3️⃣ Load image with PIL
    image = Image.open(io.BytesIO(image_bytes)).convert("L")

    # 4️⃣ Convert to NumPy
    img_np = np.array(image, dtype=np.uint8)

    # 5️⃣ Sanity check
    if img_np.shape != (28, 28):
        raise ValueError(f"Expected (28,28), got {img_np.shape}")

    return img_np
