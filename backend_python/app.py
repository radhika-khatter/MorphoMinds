from flask import Flask
from flask_cors import CORS

# ✅ English Reading
from routes.english.reading_routes import eng_reading_bp

# ✅ English Writing
from routes.english.writing_routes import bp as eng_writing_bp


# ✅ Hindi Reading Levels
from routes.hindi.reading_level1 import level1_bp
from routes.hindi.reading_level2 import level2_bp
from routes.hindi.reading_level3 import level3_bp
from routes.hindi.reading_level4 import level4_bp


# -------------------------------
# Create Flask App
# -------------------------------

app = Flask(__name__)

# Allow frontend (Vite) to call backend
CORS(app, origins=["http://localhost:5173"])


# -------------------------------
# Register Blueprints — English
# -------------------------------

app.register_blueprint(
    eng_reading_bp,
    url_prefix="/english/reading"
)


# -------------------------------
# Register Blueprints — Hindi
# -------------------------------

app.register_blueprint(
    level1_bp,
    url_prefix="/hindi/reading/level1"
)

app.register_blueprint(
    level2_bp,
    url_prefix="/hindi/reading/level2"
)

app.register_blueprint(
    level3_bp,
    url_prefix="/hindi/reading/level3"
)

app.register_blueprint(
    level4_bp,
    url_prefix="/hindi/reading/level4"
)

 #register blueprint english
app.register_blueprint(
    eng_writing_bp,
    url_prefix="/english/writing"
)

# -------------------------------
# Health Check Route
# -------------------------------

@app.route("/")
def home():
    return "✅ Backend Python ML server running"


# -------------------------------
# Run Server
# -------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5002,
        debug=True
    )

