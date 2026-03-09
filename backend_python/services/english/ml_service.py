import numpy as np
from keras import models, layers
import cv2

LABELS = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    '0','1','2','3','4','5','6','7','8','9'
]

def load_model(path):
    model = models.Sequential([
        layers.Conv2D(32, (5, 5), input_shape=(28, 28, 1), activation="relu"),
        layers.BatchNormalization(),
        layers.Conv2D(32, (5, 5), activation="relu"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.25),
        layers.BatchNormalization(),
        layers.Flatten(),
        layers.Dense(256, activation="relu"),
        layers.Dense(36, activation="softmax")
    ])

    model.compile(
        loss="categorical_crossentropy",
        optimizer="adam",
        metrics=["accuracy"]
    )

    model.load_weights(path)
    print("✅ ML Model Loaded")
    return model


def preprocess(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image, (28, 28))
    image = image / 255.0
    image = np.reshape(image, (1, 28, 28, 1))
    return image


def predict(model, image):
    processed = preprocess(image)
    pred = model.predict(processed)
    idx = np.argmax(pred[0])
    return LABELS[idx]
