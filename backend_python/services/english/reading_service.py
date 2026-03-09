import random
import string

from utils.random_word import (
    get_random_word_2letter,
    get_random_word_3to5letter,
    get_random_word_5moreletter,
)

# ---------- WORD LOGIC ----------

def generate_word(level: int):
    if level == 1:
        return random.choice(string.ascii_lowercase)
    elif level in (2, 3):
        return get_random_word_3to5letter()
    elif level == 4:
        return get_random_word_5moreletter()
    else:
        raise ValueError("Invalid level")


def check_word(expected, spoken):
    if expected and spoken:
        return expected.lower() == spoken.lower()
    return False


# ---------- SENTENCE LOGIC ----------

sentences = [
    "I am Sam",
    "The cat runs",
    "We eat food",
    "She is happy",
    "The sun shines",
    "It is hot",
    "The dog barks",
    "We play ball",
    "He is tall",
    "I like milk"
]

def get_sentence():
    return random.choice(sentences)


def check_sentence(expected, spoken):
    return expected.strip().lower() == spoken.strip().lower()
