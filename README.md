Project Analysis: MorphoMinds
Overview and Purpose

MorphoMinds is an intelligent, AI-driven educational platform tailored to assist dyslexic students in improving their reading and pronunciation skills through interactive, real-time feedback. By bridging speech recognition technology with machine learning, the platform creates a personalized learning environment that empowers students to read aloud with confidence, track their progress, and overcome common reading difficulties.

How It Works

• Word Display and Speech Capture: The system presents a word or sentence on screen. When the user reads it aloud, the app captures the speech input using a microphone interface.
• Speech-to-Text Conversion: Using speech recognition algorithms, the spoken words are transcribed into text.
• Word Comparison and Feedback: The transcribed text is matched with the target words using string-matching logic. Correct words are highlighted in green, while incorrect ones are flagged in red with visual effects (e.g., shaking).
• Pronunciation Validation: Integration with Google Dictionary APIs checks pronunciation accuracy, offering audible corrections or hints if required.
• Progress Tracking: User performance is stored and visualized, allowing learners, teachers, and parents to monitor development over time.

Real-Life Problem Solved

Dyslexia affects millions of students globally, making reading, pronunciation, and word recognition challenging. Traditional methods often lack instant feedback and personalization. MorphoMinds addresses this gap by offering:
• Immediate error detection and correction.
• Visual and auditory feedback loops to reinforce correct learning.
• Customizable learning pace with real-time progress tracking.
• An engaging and inclusive interface tailored to cognitive diversity.
This solution not only enhances literacy but also boosts the learner’s confidence and self-esteem, making education more accessible and empowering.

Tech Stack and Implementation

The platform’s frontend is built using HTML, CSS, and JavaScript as core web technologies, with Tailwind CSS for utility-first styling and React to develop dynamic, component-based interfaces. Kotlin plays a bridging role, helping integrate backend services and AI components within the web application. The backend is powered by Node.js and Express, which manage API routing and server-side logic, while MongoDB handles user data, session logs, and performance analytics using a scalable NoSQL structure. For AI and machine learning, the project utilizes Pandas and NumPy for data preprocessing, while TensorFlow and Scikit-learn are used to train a convolutional neural network (CNN) for pronunciation analysis. PyAudio captures real-time audio input, SpeechRecognition converts speech to text, and Google Dictionary APIs verify pronunciation accuracy—together forming the core intelligence layer of the platform.
Let me know if you'd like to adapt this for a report, presentation, or documentation!
