from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from module import datasets
import pandas as pd

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(device)
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small").to(device)

def simplify_sentence(sentence):
    input_text = "summarize: " + sentence
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True).to(device)
    outputs = model.generate(inputs, max_length=10, num_beams=4, early_stopping=True)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

df = datasets.amazon_sample()
names = df["name"].tolist()
summarized = list(map(simplify_sentence, names))
# Len of tokens
print(len(" ".join(names)))
print(len(" ".join(summarized)))
df["name"] = summarized
df.to_csv("summarized_55.csv", index=False)