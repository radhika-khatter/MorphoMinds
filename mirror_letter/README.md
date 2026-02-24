.

🧠 Mirror Letter Detection & Stroke Validation (MorphoMinds)

This project is part of MorphoMinds, an AI-assisted learning system designed to help children correctly write commonly confused letters such as b, d, p, q.

The system combines:

Deep Learning (CNN) → What letter was drawn?

Rule Engine (Stroke Analysis) → How was the letter drawn?

Frontend Canvas UI → Interactive handwriting practice

The goal is not just correctness, but correct writing behavior.

✨ Key Features

✍️ Canvas-based handwriting input (mouse / touch)

🧠 CNN-based letter recognition (b / d / p / q)

🔁 Mirror-letter detection (b ↔ d, p ↔ q)

📐 Stroke-based rule validation:

stroke order

loop side

loop direction

🎯 Pedagogical feedback (try again / mirrored / correct but wrong stroke)

🔄 Cyclic practice flow: b → d → p → q → repeat

🗂️ Project Structure
MIRROR-LETTER-DETECTION/
│
├── frontend/                 # Canvas UI (HTML + JS)
│
├── inference/                # FastAPI backend (inference + rules)
│   └── app.py
│
├── preprocessing/            # Image & stroke preprocessing
│   ├── stroke_capture/
│   └── image_generation/
│
├── rules/                    # Rule engine (stroke analysis)
│   ├── rule_engine.py
│   ├── stroke_order.py
│   ├── loop_side.py
│   └── stroke_direction.py
│
├── models/                   # (Optional) model artifacts
│
├── mirror_letter_cnn_correct_only.h5   # Trained CNN model
│
├── requirements.txt          # Backend dependencies
├── README.md                 # This file
└── .gitignore

🧠 High-Level System Flow
Canvas Drawing
      ↓
Frontend sends:
  - image (28×28 base64)
  - strokes (x,y points)
  - letter_hint (target)
      ↓
Backend (FastAPI)
  ├─ CNN → predicted_letter + confidence
  ├─ Confidence gate
  ├─ Rule Engine → stroke validation
  └─ Decision Logic
      ↓
Frontend Feedback
  - Correct → next letter
  - Otherwise → try again

🎨 Frontend (Canvas)
Responsibilities

Display target letter

Capture strokes (pen-down → pen-up)

Export drawing as 28×28 image

Send payload to backend

Handle feedback and progression logic

Payload sent to backend
{
  "image": "<base64 PNG>",
  "strokes": [
    {
      "points": [
        { "x": 120, "y": 40 },
        { "x": 122, "y": 45 }
      ]
    }
  ],
  "letter_hint": "b"
}

Learning Flow

Letters appear in a cyclic order:

b → d → p → q → b → ...


Only when the response is fully correct does the app move forward.

🧠 CNN Model (What letter?)

Input: 28 × 28 × 1 grayscale image

Output classes: ["b", "d", "p", "q"]

Purpose:

Identify visual letter shape

Detect mirrored letters

A confidence threshold is applied:

Low confidence → No valid character drawn

The CNN does not evaluate stroke quality.

📐 Rule Engine (How letter was drawn)

The rule engine analyzes stroke data, not pixels.

Rules Implemented
1️⃣ Stroke Order

Checks whether the child started correctly:

b / p → vertical line first

d / q → curve first

2️⃣ Loop Side

Determines if the loop is on the correct side of the stem:

Right → b, p

Left → d, q

3️⃣ Loop Direction

Detects clockwise vs anticlockwise loop motion
(used for pedagogical feedback, not strict correctness)

🧠 Decision Logic (No Ambiguity)

Decisions are made in a strict order:

Step	Condition	Feedback
1	CNN confidence too low	❌ No valid character drawn
2	Mirror detected (b↔d, p↔q)	🔄 Mirrored letter
3	Wrong letter	❌ You drew X, supposed to draw Y
4	Correct + stroke order OK	✅ Correct letter, correct way
5	Correct + stroke order wrong	⚠️ Correct letter, wrong stroke

Only Step 4 advances to the next letter.

🧪 Backend (FastAPI)
Responsibilities

Receive image + strokes

Run CNN inference

Apply rule engine

Combine results into one clear decision

Return structured response

Example Response
{
  "status": "correct",
  "predicted_letter": "b",
  "confidence": 0.96,
  "rule_details": {
    "stroke_order_ok": true,
    "loop_side": 1,
    "direction": 1
  },
  "message": "Good job! You drew the correct letter in the correct way"
}
