from backend_english_level4.decision.rule_engine import evaluate_rules


def evaluate_with_rules(cnn_letter, cnn_prob, strokes):
    """
    Hybrid evaluation:
    - CNN verifies visual identity
    - Rule engine verifies stroke correctness
    """

    # 1️⃣ Get rule evaluation
    rule_result = evaluate_rules(cnn_letter, strokes)

    rule_score = rule_result["score"]  # 0–100 scale

    # 2️⃣ Normalize CNN prob (assuming 0–1)
    cnn_score = cnn_prob * 100

    # 3️⃣ Hybrid scoring (tunable weights)
    final_score = (0.7 * cnn_score) + (0.3 * rule_score)

    # 4️⃣ Final status decision
    if final_score >= 75:
        status = "correct"
    elif final_score >= 55:
        status = "almost_correct"
    else:
        status = "wrong"

    return {
        "predicted_letter": cnn_letter,
        "cnn_confidence": round(cnn_score, 2),
        "rule_score": rule_score,
        "final_score": round(final_score, 2),
        "status": status,
        "engine": "hybrid"
    }