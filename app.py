from flask import Flask, request, jsonify
from random_word import get_random_word_2letter
from compare import check_word

app = Flask(__name__)

@app.route('/get-word', methods=['POST'])
def get_word():
    data = request.json
    level = data.get("level")

    if level == 1:
        word = get_random_word_2letter()
        return jsonify({"word": word})
    else:
        return jsonify({"error": "Invalid level"}), 400

if __name__ == '__main__':
    app.run(debug=True)
