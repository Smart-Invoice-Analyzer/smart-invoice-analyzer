from pdf2image import convert_from_path

# Convert PDF to image and save each pages
pages = convert_from_path('./images/invoice-92.pdf', 500)
for count, page in enumerate(pages):
    page.save(f'./images/out{count}.jpg', 'JPEG')
