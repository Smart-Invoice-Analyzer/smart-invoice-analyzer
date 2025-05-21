import pandas as pd

df = pd.read_csv("categorization/data.csv")

distinct_categories = df['main_category'].unique()
num_categories = len(distinct_categories)

print(f"Number of distinct categories: {num_categories}")
print(f"Categories: {distinct_categories}")
category_counts = df['main_category'].value_counts(normalize=True).mul(100).round(3).astype(str) + '%'
print(f"Normalized category counts: {category_counts}")

print(df)