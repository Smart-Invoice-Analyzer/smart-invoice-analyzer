from paddleocr import PaddleOCR

# Initialize OCR
ocr = PaddleOCR(
    use_textline_orientation=True,
    lang='en',
    cls_model_dir='app/models/cls/ch_ppocr_mobile_v2.0_cls_infer',
    det_model_dir='app/models/det/en_PP-OCRv3_det_infer',
    rec_model_dir='app/models/rec/en_PP-OCRv4_rec_infer',
    use_angle_cls=True
)

# Image path
image_path = 'app/images/B4GRGKAE9rj8W4fw5SC1hLQwhzjWL4xVMt5z5dXuBzVg.jpg'

# Run OCR
result = ocr.ocr(image_path, cls=True)

# Extract and print the text
for line in result[0]:
    text = line[1][0]
    print(text)
