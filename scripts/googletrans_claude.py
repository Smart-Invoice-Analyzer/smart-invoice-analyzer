from googletrans import Translator

def translate(text):
    translator = Translator()
    result = translator.translate(text, src='tr', dest='en')
    return result.text

def main():
    turkish_text = "PILIC DONER PORSIYON 100 GR"
    english_text = translate(turkish_text)
    print(f"Turkish: {turkish_text}")
    print(f"English: {english_text}")

if __name__ == "__main__":
    main()