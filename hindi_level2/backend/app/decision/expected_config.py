# =====================================================
# Devanagari Letter Stroke Templates (48 Letters)
# Rule-based stroke validation (No CNN)
# =====================================================

EXPECTED_CONFIG = {

# =====================================================
# क VARG (Velar)
# =====================================================

"क": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ख": {
    "stroke_count": 4,
    "strokes": [
        {"type": "curve", "direction": None},                 # 1️⃣ Curved stroke
        {"type": "vertical", "direction": "top_to_bottom"},   # 2️⃣ Vertical stroke
        {"type": "curve", "direction": None},                 # 3️⃣ Bottom curve
        {"type": "horizontal", "direction": "left_to_right"}  # 4️⃣ Shirorekha
    ],
    "rules": {"shirorekha_last": True}
},

"ग": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"घ": {
    "stroke_count": 4,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ङ": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

# =====================================================
# च VARG (Palatal)
# =====================================================

"च": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"छ": {
    "stroke_count": 4,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ज": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"झ": {
    "stroke_count": 4,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ञ": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

# =====================================================
# ट VARG (Retroflex)
# =====================================================

"ट": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ठ": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ड": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ढ": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ण": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

# =====================================================
# त VARG (Dental)
# =====================================================

"त": {
    "stroke_count": 2,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"थ": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"द": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ध": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"न": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

# =====================================================
# प VARG (Labial)
# =====================================================

"प": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"फ": {
    "stroke_count": 4,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ब": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"भ": {
    "stroke_count": 4,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"म": {
    "stroke_count": 3,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

# =====================================================
# Semi-Vowels + Sibilants + Others
# =====================================================

"य": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"र": {
    "stroke_count": 1,
    "strokes": [
        {"type": "curve", "direction": None}
    ],
    "rules": {"shirorekha_last": False}
},

"ल": {
    "stroke_count": 2,
    "strokes": [
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"व": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"श": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ष": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"स": {
    "stroke_count": 2,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
},

"ह": {
    "stroke_count": 3,
    "strokes": [
        {"type": "curve", "direction": None},
        {"type": "vertical", "direction": "top_to_bottom"},
        {"type": "horizontal", "direction": "left_to_right"}
    ],
    "rules": {"shirorekha_last": True}
}

}


# Ordered progression list
LETTER_SEQUENCE = [
    "क","ख","ग","घ","ङ",
    "च","छ","ज","झ","ञ",
    "ट","ठ","ड","ढ","ण",
    "त","थ","द","ध","न",
    "प","फ","ब","भ","म",
    "य","र","ल","व",
    "श","ष","स","ह"
]