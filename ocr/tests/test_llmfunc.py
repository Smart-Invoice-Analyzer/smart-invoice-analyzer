import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import invoiceocr

def run_on_kaggle_dataset(x):
    for i in range(x):
        # Read the image with only_texts parameter set True
        extracted_list = invoiceocr.read(f"ocr/kaggle/images/{i}.jpg", only_texts=True)
        # Extract the items with llm
        output = invoiceocr.extract_items_with_llm(extracted_list, jsonfile=f"llm_outputs/output{i}.json", model="analyzer")
        print(output)

def run_on_azerbaijan_receipt():
    # Read the image with only_texts parameter set True
    extracted_list = invoiceocr.read(f"ocr/images/indir.jpg", only_texts=True)
    # Extract the items with llm
    output = invoiceocr.extract_items_with_llm(extracted_list, jsonfile=f"llm_outputs/output_aze.json", model="analyzer")
    print(output)


if __name__ == "__main__":
    run_on_azerbaijan_receipt()