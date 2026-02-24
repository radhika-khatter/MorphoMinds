import numpy as np
import cv2
import torch
from scipy import ndimage


def preprocess_to_tensor(img_np: np.ndarray):
    """
    Convert NumPy image into:
    - image_for_rules (28x28 NumPy)
    - tensor_for_model (1x1x28x28 torch tensor)

    Input:
        img_np: uint8 NumPy array (28x28), white bg, black strokes

    Returns:
        image_for_rules: np.ndarray (28x28), float32 [0,1]
        tensor_for_model: torch.Tensor (1,1,28,28)
    """

    # =========================
    # 1️⃣ Normalize & invert
    # =========================
    img = img_np.astype(np.float32) / 255.0
    img = 1.0 - img  # strokes=1, background=0

    # Remove noise
    img[img < 0.05] = 0.0

    # =========================
    # 2️⃣ Crop to bounding box
    # =========================
    coords = np.argwhere(img > 0)

    if coords.size == 0:
        raise ValueError("Empty drawing detected")

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0) + 1

    img = img[y0:y1, x0:x1]

    # =========================
    # 3️⃣ Resize while keeping aspect ratio
    # =========================
    h, w = img.shape
    scale = 20.0 / max(h, w)
    new_h, new_w = int(h * scale), int(w * scale)

    img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

    # =========================
    # 4️⃣ Pad to 28x28
    # =========================
    pad_y = (28 - new_h) // 2
    pad_x = (28 - new_w) // 2

    img = np.pad(
        img,
        ((pad_y, 28 - new_h - pad_y),
         (pad_x, 28 - new_w - pad_x)),
        mode="constant"
    )

    # =========================
    # 5️⃣ Center by mass
    # =========================
    cy, cx = ndimage.center_of_mass(img)
    shift_y = int(14 - cy)
    shift_x = int(14 - cx)

    img = ndimage.shift(img, shift=(shift_y, shift_x), mode="constant")

    # =========================
    # 6️⃣ Final outputs
    # =========================
    image_for_rules = img.copy()

    tensor_for_model = torch.tensor(
        img, dtype=torch.float32
    ).unsqueeze(0).unsqueeze(0)

    return image_for_rules, tensor_for_model
