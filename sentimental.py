#!/usr/bin/env python3

# NOTE: this example requires PyAudio because it uses the Microphone class
import time
import datetime
import speech_recognition as sr
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk import sent_tokenize, word_tokenize, pos_tag

# log output that includes a timestamp
last_time = time.time()
def log(s):
        global last_time
        this_time = time.time()
        print("{0}: {1}".format(str(datetime.timedelta(seconds=(this_time - last_time))), s))
        last_time = this_time

lemmatizer = WordNetLemmatizer()
def penn_to_wn(tag):
    """
    Convert between the PennTreebank tags to simple Wordnet tags
    """
    if tag.startswith('J'):
        return wn.ADJ
    elif tag.startswith('N'):
        return wn.NOUN
    elif tag.startswith('R'):
        return wn.ADV
    elif tag.startswith('V'):
        return wn.VERB
    return None


def swn_polarity(text):
    """
    Return a sentiment polarity: 0 = negative, 1 = positive
    """

    sentiment = 0.0
    tokens_count = 0

    raw_sentences = sent_tokenize(text)
    for raw_sentence in raw_sentences:
        tagged_sentence = pos_tag(word_tokenize(raw_sentence))

        for word, tag in tagged_sentence:
            wn_tag = penn_to_wn(tag)
            if wn_tag not in (wn.NOUN, wn.ADJ, wn.ADV, wn.VERB):
                continue

            lemma = lemmatizer.lemmatize(word, pos=wn_tag)
            if not lemma:
                continue

            synsets = wn.synsets(lemma, pos=wn_tag)
            if not synsets:
                continue

            # Take the first sense, the most common
            synset = synsets[0]
            swn_synset = swn.senti_synset(synset.name())

            # print("lemma: {0}, pos: {1}, neg: {2}".format(lemma, swn_synset.pos_score(), swn_synset.neg_score()))
            sentiment += swn_synset.pos_score() - swn_synset.neg_score()
            tokens_count += 1

    # judgment call ? Default to positive or negative
    if not tokens_count:
        return 0

    # sum greater than 0 => positive sentiment
    # print("sentiment: {0}".format(sentiment))
    return sentiment


def callback(recognizer, audio):
    try:
        log("got audio, calling google")
        text = recognizer.recognize_google(audio)
        log("got text, calculating polarity")
        sentiment = swn_polarity(text)
        log("got polarity: {0}".format(sentiment))
        if sentiment > 0.5:
            print("POS: {0}".format(text))
        elif sentiment < -0.5:
            print("NEG: {0}".format(text))
        else:
            print("NEU: {0}".format(text))
    except sr.UnknownValueError:
        log("no speech")
    except sr.RequestError as e:
        print("ERROR: {0}".format(e))

# warm up SentiWordNet
start_time = time.time()
log("starting up")
log("warming up SentiWordNet")
swn_polarity("this is just a warm up sentance")
log("SentiWordNet is go!")


# obtain audio from the microphone
log("initializing recognizer")
r = sr.Recognizer()
log("initializing microphone")
m = sr.Microphone()

log("listening in background")
r.listen_in_background(m, callback)

log("finished")

