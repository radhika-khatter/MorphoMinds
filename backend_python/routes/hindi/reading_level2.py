# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
from gtts import gTTS
import pygame
import os

# Level 2 के लिए Blueprint बनाएँ
level2_bp = Blueprint("hindi_level2", __name__)


# Pygame mixer को initialize करें
pygame.mixer.init()

# हिंदी व्यंजन और Roman transliteration
VYANJAN = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व',
    'श', 'ष', 'स', 'ह',
    'क्ष', 'त्र', 'ज्ञ'
]

ROMAN_MAP = {
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
    'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
    'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya'
}

TEMP_AUDIO_FILE = "data/hindi_audio/temp_consonant_audio.mp3"


def pronounce(character, filename=TEMP_AUDIO_FILE):
    """
    दिए गए व्यंजन का उच्चारण करें और pygame के माध्यम से सुनाएँ
    """
    try:
        tts_object = gTTS(text=character, lang='hi', slow=False)
        tts_object.save(filename)

        pygame.mixer.music.load(filename)
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        pygame.mixer.music.unload()
        return True
    except Exception as e:
        print(f"[त्रुटि] ऑडियो चलाने में समस्या: {e}")
        return False

@level2_bp.route("/consonant/pronounce", methods=["POST"])
def consonant_pronounce():
    """
    व्यंजन उच्चारण के लिए एंडपॉइंट
    Request JSON: {"consonant": "क"}
    """
    data = request.json
    consonant = data.get("consonant")
    if consonant not in VYANJAN:
        return jsonify({"success": False, "message": "अमान्य व्यंजन"}), 400

    success = pronounce(consonant)
    return jsonify({"success": success, "consonant": consonant, "roman": ROMAN_MAP.get(consonant)})

@level2_bp.route("/consonant/list", methods=["GET"])
def consonant_list():
    """
    सभी व्यंजन और उनके Roman transliteration की सूची प्राप्त करें
    """
    return jsonify({"consonants": VYANJAN, "roman": ROMAN_MAP})
