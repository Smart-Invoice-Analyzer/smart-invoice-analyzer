import paddle
import cv2
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
import re
import ollama
from paddleocr import PaddleOCR

__all__ = [
    "init", "read", "read_to_json", "extract_date", "extract_total",
    "extract_items_with_llm", "to_list_of_texts"
]

# Create OCR object and disable GPU to avoid CUDA issues
ocr = None
def init():
    """
    Initialize the OCR
    """
    global ocr
    ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu = False)

# An hidden function that extracts all texts from OCR output. It should not be called directly.
def to_list_of_texts(extracted_list):
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
        return to_list_of_texts(extracted_list)
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
        full_text = ' '.join(to_list_of_texts(extracted_list))
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
    full_text = " ".join([item["text"] for item in ocr_data])
    last_resort_match = re.search(r"total.*?(\d+\.\d{2})", full_text, re.I)
    return float(last_resort_match.group(1)) if last_resort_match else None

# Extract the items using Large Language Model, then save to a json file
def extract_items_with_llm(extracted_list, jsonfile:str, model:str="analyzer"):
    delimiter = "\n"
    # This function requires to check only_texts parameter of the variable 'extracted_list', we will have to check it
    isOnlyTexts:bool
    if type(extracted_list[0]) == str:
        isOnlyTexts = True
    else:
        isOnlyTexts = False
    # Concatenate into a single string, here it depends if it is only texts or not. If not, we will have to change it to only_texts
    if isOnlyTexts: 
        text = delimiter.join(extracted_list)
    else:
        text = delimiter.join(to_list_of_texts(extracted_list))
    # Check if parameter jsonfile is a json file
    if not jsonfile.lower().endswith(".json"):
        raise ValueError("Output file must be a JSON file")
    available_models = ["analyzer"]
    # Check if model is a correct string
    if model not in available_models:
        raise ValueError(f"The model must be one of our available models: {available_models}")
    # Define prompt
    prompt:str
    if model == "analyzer":
        prompt = f"{text}"
    # Call the LLM API
    response = ollama.generate(
        model=model,
        prompt=prompt
    )
    json_output = response["response"]
    # Save the output to the jsonfile
    with open(jsonfile, "w", encoding="utf-8") as f:
            f.write(json_output)
    # Return the json output
    return json_output



# GET IMAGES USING HTTP REQUESTS
import requests

def get_id(url):
    return url.split("/")[-1].split("=")[1]

def download_image(id, filename="receipt.jpg", csrf_token=None):
    database_url = "https://monitoring.e-kassa.gov.az/pks-monitoring/2.0.0/documents/"
    url = database_url + id
    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Host": "monitoring.e-kassa.gov.az",
        "Referer": "https://monitoring.e-kassa.gov.az/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "User-Lang": "en",
        "User-Time-Zone": "Europe/Istanbul"
    }

    if csrf_token:
        headers["X-CSRF-Token"] = csrf_token

    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"Image '{filename}' downloaded successfully.")
        else:
            print(f"Failed. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
