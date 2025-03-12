import paddle
import cv2
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
import re
from paddleocr import PaddleOCR

# Create OCR object and disable GPU to avoid CUDA issues
ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu = False)

# Apply OCR
def read(image_path:str):
    # Open the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply OCR
    extracted_list = ocr.ocr(image, cls=True)
    # Since it is one picture being read, there will be only one page. We can remove the unnecessary nested list
    extracted_list = extracted_list[0]
    # Return extracted list
    return extracted_list

def read_to_json(image_path:str, output_file:str):
    # Check if it is a json file
    if not output_file.lower().endswith(".json"):
        raise ValueError("Output file must be a JSON file")
    # Apply OCR
    extracted_list = read(image_path)
    # Save to a .json file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(extracted_list, f, ensure_ascii=False)
    return None

def _all_texts(extracted_list):
    # Merge all texts in OCR output
    all_texts = []
    for line in extracted_list:
        if line:  # Boş satırları atla
            text = line[1][0]  # Metin kısmı: line -> [[coordinates], (text, confidence)]
            all_texts.append(text)
    return all_texts

def extract_date(extracted_list):
    # Concatenate into a single string
    full_text = ' '.join(_all_texts(extracted_list))
    # Find the match
    date_match = re.search(r"(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})", full_text)
    date = date_match.group(0) if date_match else None
    # Return date
    return date

if __name__ == "__main__":
    image_path = "./invoiceocr/kaggle/images/5.jpg"
    # Text count
    #print("Text count: ", len(read(image_path)))
    # Read text to json
    #read_to_json(image_path, "./data.json")
    #print(extract_date(read(image_path)))

    # Extract "Date" data from each image

    # Number of images
    NUM_IMAGES = 20
    dates = []

    for i in range(NUM_IMAGES):
        # Image path
        image_path = f"./invoiceocr/kaggle/images/{i}.jpg"
        dates.append(extract_date(read(image_path)))
    print(dates)