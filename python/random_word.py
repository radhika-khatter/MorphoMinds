import os
import csv
import random
CSV_PATH = os.path.join(os.path.dirname(__file__), 'google-10000-english2.csv')

def get_random_word_2letter():
    with open(CSV_PATH, 'r') as file:
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
    with open(CSV_PATH, 'r') as file:
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
    with open(CSV_PATH, 'r') as file:
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
    with open(CSV_PATH, 'r') as file:
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