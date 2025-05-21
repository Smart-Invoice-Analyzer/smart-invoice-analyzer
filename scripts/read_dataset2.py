from module import datasets
import os

os.system("pwd")

df = datasets.amazon_summarized(11)
print(df)