from random_word import get_random_word_2letter
from random_word import get_random_word_3to5letter
from random_word import get_random_word_6to8letter
from random_word import get_random_word_9letter
from compare import check_word

def main():
    a = (int(input("Enter your level\n")))
    if a==1:
        word = get_random_word_2letter() 
    elif a==2:
        word = get_random_word_3to5letter()
    elif a==3:
        word = get_random_word_6to8letter()
    elif a==4:
        word = get_random_word_9letter()
    else:
        print("Invalid level input! Try again\n")
    print(f"\n🔤 Your word is: {word}")
    check_word(word)

while(1):
    main()