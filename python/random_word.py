import random
import csv

def get_random_word_2letter():
    with open('MorphoMinds/Word_Reading/google-10000-english.csv', 'r') as file:
        reader = csv.reader(file)
        word_list = [row[0] for row in reader if row]  # Assuming each row has one word
        x = 0
        while(x==0):
            wrd = random.choice(word_list)
            if len(wrd) == 2:
                x=1
                return wrd
            else:
                continue

def get_random_word_3to5letter():
    with open('MorphoMinds/Word_Reading/google-10000-english.csv', 'r') as file:
        reader = csv.reader(file)
        word_list = [row[0] for row in reader if row]  # Assuming each row has one word
        x = 0
        while(x==0):
            wrd = random.choice(word_list)
            if len(wrd) > 2 and len(wrd) <= 5:
                x=1
                return wrd
            else:
                continue

def get_random_word_6to8letter():
    with open('MorphoMinds/Word_Reading/google-10000-english.csv', 'r') as file:
        reader = csv.reader(file)
        word_list = [row[0] for row in reader if row]  # Assuming each row has one word
        x = 0
        while(x==0):
            wrd = random.choice(word_list)
            if len(wrd) > 6 and len(wrd) <= 8:
                x=1
                return wrd
            else:
                continue

def get_random_word_9letter():
    with open('MorphoMinds/Word_Reading/google-10000-english.csv', 'r') as file:
        reader = csv.reader(file)
        word_list = [row[0] for row in reader if row]  # Assuming each row has one word
        x = 0
        while(x==0):
            wrd = random.choice(word_list)
            if len(wrd) > 8:
                x=1
                return wrd
            else:
                continue