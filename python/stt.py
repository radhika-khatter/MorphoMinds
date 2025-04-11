import speech_recognition as sr

r = sr.Recognizer()

def record_text():
    while True:
        try:
            with sr.Microphone() as source2:
                r.adjust_for_ambient_noise(source2, duration=0.2)
                print("Listening...")
                audio2 = r.listen(source2)
                MyText = r.recognize_google(audio2)
                MyText_spaceRemoved = MyText.replace(" ","")
                # first_word = MyText.strip().split()[0] if MyText.strip() else ""
                return MyText_spaceRemoved
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
        except sr.UnknownValueError:
            print("Unknown error occurred")
