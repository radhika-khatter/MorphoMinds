# import speech_recognition as sr
# # Mapping of possible pronunciations to letters
# phonetic_map = {
#     'A': ['ye', 'a', 'yay'],
#     'B': ['be', 'bee'],
#     'C': ['see', 'sea'],
#     'D': ['thee', 'dee', 'de'],
#     'E': ['eh', 'ee'],
#     'F': ['eff', 'f'],
#     'G': ['jee'],
#     'H': ['edge', 'hedge', 'hatch', 'itch'],
#     'I': ['aye', 'eye', 'i'],
#     'J': ['je', 'jay', 'joy'],
#     'K': ['kay', 'ke'],
#     'L': ['el', 'yell', 'hell'],
#     'M': ['am', 'yam', 'em'],
#     'N': ['yen', 'en'],
#     'O': ['oh', 'vow', 'waw'],
#     'P': ['pee', 'pay', 'pie'],
#     'Q': ['queue'],
#     'R': ['are', 'err', 'year'],
#     'S': ['yes', 'ass', 's'],
#     'T': ['tee', 'tea'],
#     'U': ['you', 'u'],
#     'V': ['we', 'wee'],
#     'W': ['double you', 'w'],
#     'X': ['axe'],
#     'Y': ['why'],
#     'Z': ['zed', 'zee', 'jed']
# }



# def speech_to_text():
#     recognizer = sr.Recognizer()
#     with sr.Microphone() as source:
#         print("Listening... Speak now!")
#         recognizer.adjust_for_ambient_noise(source)  # Adjusts for background noise
#         audio = recognizer.listen(source)

#     try:
#         text = recognizer.recognize_google(audio)  # Using Google's speech recognition API
#         print("You said:", text)
#         return text
#     except sr.UnknownValueError:
#         print("Sorry, I could not understand the audio.")
#     except sr.RequestError:
#         print("Could not request results, check your internet connection.")

# word = speech_to_text()

# for key,value in phonetic_map.items():
#     for i in value:
#         if word == i:
#             print("Your spoken character is" , key )
#         else:
#             print("incorrect word spoken")

import speech_recognition as sr

# Mapping of possible pronunciations to letters
phonetic_map = {
    'A': ['ye', 'a', 'yay'],
    'B': ['be', 'bee'],
    'C': ['see', 'sea'],
    'D': ['thee', 'dee', 'de'],
    'E': ['eh', 'ee'],
    'F': ['eff', 'f'],
    'G': ['jee'],
    'H': ['edge', 'hedge', 'hatch', 'itch'],
    'I': ['aye', 'eye', 'i'],
    'J': ['je', 'jay', 'joy'],
    'K': ['kay', 'ke'],
    'L': ['el', 'yell', 'hell'],
    'M': ['am', 'yam', 'em'],
    'N': ['yen', 'en'],
    'O': ['oh', 'vow', 'waw'],
    'P': ['pee', 'pay', 'pie'],
    'Q': ['queue'],
    'R': ['are', 'err', 'year'],
    'S': ['yes', 'ass', 's'],
    'T': ['tee', 'tea'],
    'U': ['you', 'u'],
    'V': ['we', 'wee'],
    'W': ['double you', 'w'],
    'X': ['axe'],
    'Y': ['why'],
    'Z': ['zed', 'zee', 'jed']
}

def speech_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening... Speak now!")
        recognizer.adjust_for_ambient_noise(source)  # Adjusts for background noise
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)  # Using Google's speech recognition API
        text = text.lower()  # Convert to lowercase for comparison
        print("You said:", text)
        return text
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
        return None
    except sr.RequestError:
        print("Could not request results, check your internet connection.")
        return None

word = speech_to_text()

if word:
    found = False
    for key, values in phonetic_map.items():
        if word in values:
            print("Your spoken character is:", key)
            found = True
            break  # Stop checking once we find a match

    if not found:
        print("Incorrect word spoken. Try again.")