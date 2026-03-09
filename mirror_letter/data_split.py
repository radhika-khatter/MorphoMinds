import os
import shutil
import random

# -----------------------
# CONFIG
# -----------------------
BASE_DIR = "data/processed/images"
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "val")

CLASSES = ["b_correct", "d_correct", "p_correct", "q_correct"]
VAL_SPLIT = 0.2
SEED = 42

random.seed(SEED)

# -----------------------
# CREATE VAL DIRS
# -----------------------
os.makedirs(VAL_DIR, exist_ok=True)

for cls in CLASSES:
    os.makedirs(os.path.join(VAL_DIR, cls), exist_ok=True)

# -----------------------
# SPLIT DATA
# -----------------------
for cls in CLASSES:
    class_train_path = os.path.join(TRAIN_DIR, cls)
    class_val_path   = os.path.join(VAL_DIR, cls)

    images = [
        f for f in os.listdir(class_train_path)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ]

    random.shuffle(images)

    val_count = int(len(images) * VAL_SPLIT)
    val_images = images[:val_count]

    for img in val_images:
        src = os.path.join(class_train_path, img)
        dst = os.path.join(class_val_path, img)
        shutil.move(src, dst)

    print(f"{cls}: moved {len(val_images)} images to validation")

print("✅ Train/Validation split complete")
