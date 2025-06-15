import invoiceocr

# Image number
i = 1
# Read the image, only_texts and no coordinates
extracted_list = invoiceocr.read(f"ocr/kaggle/images/{i}.jpg", only_texts=True)
# Print the extracted_data as a string
print(" ".join(extracted_list))
