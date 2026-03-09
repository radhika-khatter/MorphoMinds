import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# -----------------------
# CONFIG
# -----------------------
IMG_SIZE = (28, 28)
BATCH_SIZE = 64
EPOCHS = 20

BASE_DIR = "data/processed/images"

TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "val")
TEST_DIR  = os.path.join(BASE_DIR, "test")

# Explicit class order (VERY IMPORTANT)
CLASSES = ["b_correct", "d_correct", "p_correct", "q_correct"]

# -----------------------
# DATA GENERATORS
# -----------------------
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=5,
    width_shift_range=0.05,
    height_shift_range=0.05,
    zoom_range=0.05
)

val_test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    color_mode="grayscale",
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    classes=CLASSES
)

val_gen = val_test_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    color_mode="grayscale",
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    classes=CLASSES
)

test_gen = val_test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    color_mode="grayscale",
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    classes=CLASSES,
    shuffle=False
)

print("Raw class indices:", train_gen.class_indices)

# Logical mapping (used later in inference)
LABEL_MAP = {
    0: "b",
    1: "d",
    2: "p",
    3: "q"
}

# -----------------------
# MODEL
# -----------------------
model = models.Sequential([
    layers.Input(shape=(28, 28, 1)),

    layers.Conv2D(32, (3, 3), activation="relu"),
    layers.MaxPooling2D(2, 2),

    layers.Conv2D(64, (3, 3), activation="relu"),
    layers.MaxPooling2D(2, 2),

    layers.Conv2D(128, (3, 3), activation="relu"),
    layers.Flatten(),

    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),

    layers.Dense(4, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# -----------------------
# TRAIN
# -----------------------
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS
)

# -----------------------
# EVALUATE
# -----------------------
test_loss, test_acc = model.evaluate(test_gen)
print(f"Test Accuracy: {test_acc:.4f}")

# -----------------------
# SAVE MODEL
# -----------------------
#model.save("mirror_letter_cnn_correct_only.h5")
#print("Model saved as mirror_letter_cnn_correct_only.h5")

model = tf.keras.models.load_model("mirror_letter_cnn_correct_only.h5")
model.save("mirror_letter_tf215.h5", save_format="h5")
