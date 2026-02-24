from flask import Blueprint, request, jsonify

from services.english.reading_service import (
    generate_word,
    check_word,
    get_sentence,
    check_sentence,
)

eng_reading_bp = Blueprint("eng_reading", __name__)


@eng_reading_bp.route("/get-word")
def get_word():
    level = int(request.args.get("level", 1))
    word = generate_word(level)
    return jsonify({"word": word})


@eng_reading_bp.route("/check-word", methods=["POST"])
def check_word_api():
    data = request.json
    result = check_word(
        data.get("expected_word"),
        data.get("spoken_word")
    )
    return jsonify({"correct": result})


@eng_reading_bp.route("/get-sentence")
def get_sentence_api():
    return jsonify({"sentence": get_sentence()})


@eng_reading_bp.route("/check-sentence", methods=["POST"])
def check_sentence_api():
    data = request.json
    result = check_sentence(
        data.get("expected_sentence", ""),
        data.get("spoken_sentence", "")
    )
    return jsonify({"correct": result})
