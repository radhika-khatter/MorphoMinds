from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.utils.stroke_processing import normalize_strokes
from app.decision.rule_engine import evaluate_rules
from app.decision.expected_config import LETTER_SEQUENCE


router = APIRouter()

# =====================================================
# Request Models
# =====================================================

class Point(BaseModel):
    x: float
    y: float
    t: int


class StrokeRequest(BaseModel):
    letter: str
    strokes: List[List[Point]]
    image: str  # kept for compatibility (not used anymore)


# =====================================================
# Get Letter By Index (Sequential Order)
# =====================================================

@router.get("/next-letter")
def get_next_letter(index: int = 0):

    # Restart sequence if exceeded
    if index >= len(LETTER_SEQUENCE):
        index = 0

    return {
        "target_letter": LETTER_SEQUENCE[index],
        "next_index": index + 1,
        "total_letters": len(LETTER_SEQUENCE)
    }


# =====================================================
# Evaluate Endpoint (Rule-Based Only)
# =====================================================

@router.post("/evaluate")
def evaluate_strokes(request: StrokeRequest):

    # --------------------------
    # Convert strokes to dict
    # --------------------------

    strokes = [
        [point.dict() for point in stroke]
        for stroke in request.strokes
    ]

    # --------------------------
    # Normalize strokes
    # --------------------------

    normalized = normalize_strokes(strokes)

    # --------------------------
    # Rule Engine Evaluation
    # --------------------------

    rule_result = evaluate_rules(request.letter, normalized)

    return {
        "letter_expected": request.letter,
        "rule_score": rule_result["overall_score"],
        "feedback": rule_result["feedback"],
        "errors": rule_result.get("errors", {})
    }