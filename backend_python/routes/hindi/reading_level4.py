# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
import random
from fuzzywuzzy import fuzz
import speech_recognition as sr

# Level 4 के लिए Blueprint बनाएँ
level4_bp = Blueprint("hindi_level4", __name__)


# Sentences Data
SENTENCES = [
    {'hindi': 'नमस्ते', 'english': 'Hello'},
    {'hindi': 'आप कैसे हैं', 'english': 'How are you?'},
    {'hindi': 'मैं ठीक हूँ', 'english': 'I am fine.'},
    {'hindi': 'आपका नाम क्या है', 'english': 'What is your name?'},
    {'hindi': 'मेरा नाम सोनिया है', 'english': 'My name is Sonia.'},
    {'hindi': 'आज मौसम अच्छा है', 'english': 'The weather is nice today.'},
    {'hindi': 'यह एक किताब है', 'english': 'This is a book.'},
    {'hindi': 'मुझे पानी चाहिए', 'english': 'I want water.'},
    {'hindi': 'घर चलो', 'english': "Let's go home."},
    {'hindi': 'मुझे हिंदी सीखना पसंद है', 'english': 'I like learning Hindi.'}
]

SIMILARITY_THRESHOLD = 75
recognizer = sr.Recognizer()

@level4_bp.route("/sentence/random", methods=["GET"])
def random_sentence():
    """
    Random Sentence API
    Frontend को एक random sentence भेजें जिसे user pronounce करे
    """
    sentence_data = random.choice(SENTENCES)
    return jsonify(sentence_data)

@level4_bp.route("/sentence/check", methods=["POST"])
def check_sentence():
    """
    User की आवाज़ की पहचान करें और correctness लौटाएँ
    Request JSON: {"hindi": "<target>", "audio_file_path": "<path>"}
    """
    data = request.json
    target_hindi = data.get("hindi")
    audio_file_path = data.get("audio_file_path")

    if not target_hindi or not audio_file_path:
        return jsonify({"success": False, "message": "Hindi sentence या Audio Path missing"}), 400

    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)
        recognized_text = recognizer.recognize_google(audio, language="hi-IN")
        similarity_score = fuzz.ratio(target_hindi, recognized_text)
        correct = similarity_score >= SIMILARITY_THRESHOLD
        return jsonify({
            "success": True,
            "target_hindi": target_hindi,
            "recognized_text": recognized_text,
            "similarity_score": similarity_score,
            "correct": correct
        })
    except sr.UnknownValueError:
        return jsonify({"success": True, "recognized_text": "", "correct": False})
    except sr.RequestError as e:
        return jsonify({"success": False, "message": f"API Error: {e}"}), 500
