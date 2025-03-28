import paddle
import cv2
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
import re
import ollama
from paddleocr import PaddleOCR

# Create OCR object and disable GPU to avoid CUDA issues
ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu = False)

# An hidden function that extracts all texts from OCR output. It should not be called directly.
def _all_texts(extracted_list):
    # Merge all texts in OCR output
    all_texts = []
    for line in extracted_list:
        if line:
            text = line[1][0] # [coordinates], (text, confidence)]
            all_texts.append(text)
    return all_texts

# Apply OCR
def read(image_path:str, only_texts=False):
    """
    Core read function.
    Returns a list of extracted data, named "extracted_list"
    """
    # Open the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply OCR
    extracted_list = ocr.ocr(image, cls=True)
    # Since it is one picture being read, there will be only one page. We can remove the unnecessary nested list
    extracted_list = extracted_list[0]
    # Check if only the texts are requested, return only the texts in a list
    if only_texts:
        return _all_texts(extracted_list)
    # Else return full list in the shape of [[coordinates], (text, confidence)]
    else:
        return extracted_list

def read_to_json(image_path:str, jsonfile:str):
    # Check if parameter jsonfile is a json file
    if not jsonfile.lower().endswith(".json"):
        raise ValueError("Output file must be a JSON file")
    # Apply OCR
    extracted_list = read(image_path)
    # Save to a .json file
    with open(jsonfile, "w", encoding="utf-8") as f:
        json.dump(extracted_list, f, ensure_ascii=False)
    return None

def extract_date(extracted_list):
    # This function requires to check only_texts parameter of the variable 'extracted_list', we will have to check it
    isOnlyTexts:bool
    if type(extracted_list[0]) == str:
        isOnlyTexts = True
    else:
        isOnlyTexts = False
    # Concatenate into a single string, here it depends if it is only texts or not. If not, we will have to change it to only_texts
    if not isOnlyTexts: 
        full_text = ' '.join(_all_texts(extracted_list))
    else:
        full_text = ' '.join(extracted_list)
    # Find the match
    date_match = re.search(r"(\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4})", full_text)
    date = date_match.group(0) if date_match else None
    # Return date
    return date

def extract_total(extracted_list):
    # This function requires to check only_texts parameter of the variable 'extracted_list', we will have to check it
    isOnlyTexts:bool
    if type(extracted_list[0]) == str:
        isOnlyTexts = True
    else:
        isOnlyTexts = False
    # We need isOnlyTexts to be False to make the function work because we will need the coordinates. If it is only texts, raise Error
    if isOnlyTexts:
        raise ValueError("Extracted list must be a full list and include coordinates. Generate a new one using read() function with the function parameter only_texts=False")
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
    # Find rows containing TOTAL (case-insensitive), ignore these words: tax vat vergi
    total_lines = [
        item for item in ocr_data 
        if re.search(r"\btotal\b", item["text"], re.IGNORECASE)
        and not re.search(r"tax|vat|vergi", item["text"], re.IGNORECASE)
    ]
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
    # TESTS for LAST RESORT
    # ✅ Test: 'total 23.19' -> 23.19 (Beklenen: 23.19)
    # ✅ Test: 'Total:42.50 USD' -> 42.5 (Beklenen: 42.5)
    # ✅ Test: 'TOTAL-15.75' -> 15.75 (Beklenen: 15.75)
    # ✅ Test: 'tax total is 18.99' -> 18.99 (Beklenen: 18.99)
    # ❌ Test: 'subtotal 20.00, total 22.50' -> 20.0 (Beklenen: 22.5)  # Problem!
    # ✅ Test: 'total\n8.93' -> 8.93 (Beklenen: 8.93)
    # ❌ Test: 'TOTALTAX0.98' -> 0.98 (Beklenen: None)  # Yanlış pozitif!
    # ✅ Test: 'total= abc5.67' -> None (Beklenen: None)
    # ✅ Test: 'total 123' -> None (Beklenen: None)
    # ✅ Test: 'final total is 100.00' -> 100.0 (Beklenen: 100.0)
    # ✅ Test: 'total' -> None (Beklenen: None)
    # ✅ Test: 'total1.2.34' -> None (Beklenen: None)
    # 10/12 tests
    # -- Most of the Total prices on kaggle/images/ data set are found in this operation! --
    full_text = " ".join([item["text"] for item in ocr_data])
    last_resort_match = re.search(r"total.*?(\d+\.\d{2})", full_text, re.I)
    return float(last_resort_match.group(1)) if last_resort_match else None

# Extract the items using Large Language Model, then save to a json file
def extract_items_with_llm(extracted_list, jsonfile:str, model:str="analyzer"):
    # This function requires to check only_texts parameter of the variable 'extracted_list', we will have to check it
    isOnlyTexts:bool
    if type(extracted_list[0]) == str:
        isOnlyTexts = True
    else:
        isOnlyTexts = False
    # Concatenate into a single string, here it depends if it is only texts or not. If not, we will have to change it to only_texts
    if isOnlyTexts: 
        text = ' '.join(extracted_list)
    else:
        text = ' '.join(_all_texts(extracted_list))
    # Check if parameter jsonfile is a json file
    if not jsonfile.lower().endswith(".json"):
        raise ValueError("Output file must be a JSON file")
    available_models = ["analyzer", "llama3"]
    # Check if model is a correct string
    if model not in available_models:
        raise ValueError(f"The model must be one of our available models: {available_models}")
    # Define prompt
    prompt:str
    if model == "llama3":
        prompt = f"""
        Analyze the receipt text below and output the purchased products in JSON format.
        Include 'description', 'quantity', and 'unit_price' fields only, with the product name as 'description'. Don't include anything else in the JSON.

        Receipt text:
        {text}

        Respond in JSON format. Do NOT provide anything else.
        """
    elif model == "analyzer":
        prompt = f"{text}"
    # Call the LLM API
    response = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}])
    json_output = response["message"]["content"]
    # Save the output to the jsonfile
    with open(jsonfile, "w", encoding="utf-8") as f:
            f.write(json_output)
