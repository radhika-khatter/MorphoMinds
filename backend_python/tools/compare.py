from stt import record_text

def check_word(target_word):
    while True:
        print("Please read the word aloud...")
        user_word = record_text()
        print(f"You said: {user_word}")

        if user_word.lower() == target_word.lower():
            print("✅ Correct!")
            break
        else:
            print("❌ Incorrect! Try again.")
