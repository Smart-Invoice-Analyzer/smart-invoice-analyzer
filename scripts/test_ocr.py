from module import invoiceocr

# Activate the GPU
invoiceocr.init()

# Read image
texts = invoiceocr.read("ocr/images/ornek3.jpg",only_texts=True)

for i in texts:
    print(i)
