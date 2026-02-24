# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
from gtts import gTTS
import pygame
import os

# Level 1 के लिए Blueprint बनाएँ
level1_bp = Blueprint("hindi_level1", __name__)


# Pygame mixer को initialize करें
pygame.mixer.init()

# हिंदी स्वर और उनके Roman transliteration
SWAR = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः']
ROMAN_MAP = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah'
}

TEMP_AUDIO_FILE = "temp_vowel_audio.mp3"

def pronounce(character, filename=TEMP_AUDIO_FILE):
    """
    दिए गए स्वर का उच्चारण करें और pygame के माध्यम से सुनाएँ
    """
    try:
        # gTTS से ऑडियो बनाएं
        tts_object = gTTS(text=character, lang='hi', slow=False)
        tts_object.save(filename)

        # pygame के माध्यम से ऑडियो चलाएँ
        pygame.mixer.music.load(filename)
        pygame.mixer.music.play()

        # जब तक ऑडियो चल रहा है, इंतजार करें
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        # फ़ाइल लॉक को रिलीज़ करने के लिए unload करें
        pygame.mixer.music.unload()
        return True
    except Exception as e:
        print(f"[त्रुटि] ऑडियो चलाने में समस्या: {e}")
        return False

@level1_bp.route("/pronounce", methods=["POST"])
def vowel_pronounce():
    """
    स्वर उच्चारण के लिए एंडपॉइंट
    Request JSON: {"vowel": "अ"}
    """
    data = request.json
    vowel = data.get("vowel")
    if vowel not in SWAR:
        return jsonify({"success": False, "message": "अमान्य स्वर"}), 400

    success = pronounce(vowel)
    return jsonify({"success": success, "vowel": vowel, "roman": ROMAN_MAP.get(vowel)})

@level1_bp.route("/list", methods=["GET"])
def vowel_list():
    """
    सभी स्वर और उनके Roman transliteration की सूची प्राप्त करें
    """
    return jsonify({"vowels": SWAR, "roman": ROMAN_MAP})
