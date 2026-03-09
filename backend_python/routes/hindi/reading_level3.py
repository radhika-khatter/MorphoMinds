# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
import random
import speech_recognition as sr

# Level 3 के लिए Blueprint बनाएँ
level3_bp = Blueprint("hindi_level3", __name__)

# स्वर और व्यंजन
SWAR = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः']
VYANJAN = [
    'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 
    'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व',
    'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'
]
ALL_CHARACTERS = SWAR + VYANJAN

recognizer = sr.Recognizer()

@level3_bp.route("/pronunciation/random", methods=["GET"])
def random_character():
    """
    Random Character API
    """
    char_to_speak = random.choice(ALL_CHARACTERS)
    return jsonify({"character": char_to_speak})

@level3_bp.route("/pronunciation/check", methods=["POST"])
def check_pronunciation():
    """
    Accepts FormData: 'file' (audio) and 'letter'
    """
    if "file" not in request.files or "letter" not in request.form:
        return jsonify({"success": False, "message": "File or Letter missing"}), 400

    audio_file = request.files["file"]
    character = request.form["letter"]

    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
        recognized_text = recognizer.recognize_google(audio, language="hi-IN")

        correct = character in recognized_text
        return jsonify({
            "success": True,
            "character": character,
            "recognized_text": recognized_text,
            "correct": correct,
            "message": "उच्चारण सही है ✅" if correct else "गलत उच्चारण ❌"
        })
    except sr.UnknownValueError:
        return jsonify({
            "success": True,
            "character": character,
            "recognized_text": "",
            "correct": False,
            "message": "आवाज़ समझ नहीं आई ❌"
        })
    except sr.RequestError as e:
        return jsonify({"success": False, "message": f"API Error: {e}"}), 500
