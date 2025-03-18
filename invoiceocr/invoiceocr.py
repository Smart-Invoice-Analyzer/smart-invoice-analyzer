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

# An hidden function that extracts all texts from OCR output. It should not be called directly.
def _all_texts(extracted_list):
    # Merge all texts in OCR output
    all_texts = []
    for line in extracted_list:
        if line:  # Boş satırları atla
            text = line[1][0]  # Metin kısmı: line -> [[coordinates], (text, confidence)]
            all_texts.append(text)
    return all_texts

# Apply OCR
def read(image_path:str, only_text=False):
    # Open the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply OCR
    extracted_list = ocr.ocr(image, cls=True)
    # Since it is one picture being read, there will be only one page. We can remove the unnecessary nested list
    extracted_list = extracted_list[0]
    # Check if only text is requested
    if only_text:
        return _all_texts(extracted_list)
    else:
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

def extract_date(extracted_list):
    # Concatenate into a single string
    full_text = ' '.join(_all_texts(extracted_list))
    # Find the match
    date_match = re.search(r"(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})", full_text)
    date = date_match.group(0) if date_match else None
    # Return date
    return date

def extract_total(extracted_list):
    # Collect all texts and coordinates (single level list)
    ocr_data = []
    for line in extracted_list:
        if line and len(line) >= 2:
            coords = line[0]
            text = line[1][0].lower()
            ocr_data.append({
                "text": text,
                "x": coords[0][0],  # Top left X
                "y": coords[0][1],  # Top left Y
                "width": coords[1][0] - coords[0][0]  # Width
            })

    # Find rows containing TOTAL (case-insensitive)
    total_lines = [item for item in ocr_data if "total" in item["text"]]

    # Logic to find the most probable TOTAL
    for total_item in sorted(total_lines, key=lambda x: x["y"], reverse=True):
        # 1. Search for numbers in the same line
        same_line_match = re.search(r"\d+\.\d{2}", total_item["text"])
        if same_line_match:
            return float(same_line_match.group())
        
        # 2. Search on the right side (same Y axis ±5 pixels)
        right_candidates = [
            item for item in ocr_data
            if (abs(item["y"] - total_item["y"]) < 5) and
               (item["x"] > total_item["x"] + total_item["width"])
        ]
        
        # Filter numeric values
        for candidate in sorted(right_candidates, key=lambda x: x["x"]):
            amount_match = re.search(r"\d+\.\d{2}", candidate["text"])
            if amount_match:
                return float(amount_match.group())

    # 3. Last resort: Search full text
    full_text = " ".join([item["text"] for item in ocr_data])
    last_resort_match = re.search(r"total.*?(\d+\.\d{2})", full_text, re.I)
    return float(last_resort_match.group(1)) if last_resort_match else None