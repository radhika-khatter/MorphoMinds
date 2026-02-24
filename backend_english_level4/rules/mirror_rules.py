def mirror_confusion(target, rule_result):
    """
    If target rule fails but opposite mirror rule would pass
    """
    if target == "b" and "left" in rule_result.lower():
        return True, "Possible mirror: d instead of b"

    if target == "d" and "right" in rule_result.lower():
        return True, "Possible mirror: b instead of d"

    return False, ""
