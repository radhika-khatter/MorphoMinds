from flask import Blueprint, request, jsonify
import base64, io
import numpy as np
from PIL import Image


from services.english.ml_service import load_model, predict

bp = Blueprint("english_writing", __name__)

model = load_model("models/best_val_loss_model.h5")


@bp.route("/predict", methods=["POST"])
def predict_letter():
    data = request.get_json()

    if "image" not in data:
        return jsonify({"error": "No image"}), 400

    image_data = data["image"].split(",")[-1]

    image_bytes = io.BytesIO(base64.b64decode(image_data))
    pil_image = Image.open(image_bytes).convert("RGB")

    opencv_img = np.array(pil_image)[:, :, ::-1].copy()

    result = predict(model, opencv_img)

    return jsonify({"prediction": result})
