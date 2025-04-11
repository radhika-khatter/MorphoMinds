import speech_recognition as sr
import pyttsx3
r = sr.Recognizer()
def record_text():
    while(1):
        try:
            with sr.Microphone() as source2:
                r.adjust_for_ambient_noise(source2, duration=0.2)
                print("Listening....")
                audio2 = r.listen(source2)
                MyText = r.recognize_google(audio2)
                return MyText
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
        except sr.UnknownValueError:
            print("unknown error occurred")
    return
def output_text(text):
    first_word = text.strip().split()[0] if text.strip() else ""
    with open("MorphoMinds/output.txt", "w") as f:
        f.write(first_word)
    return
while(1):
    text = record_text()
    output_text(text)
    print("Wrote text: ", text)