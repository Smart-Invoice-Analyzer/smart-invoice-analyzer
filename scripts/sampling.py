import pandas as pd
from sklearn.model_selection import train_test_split
from module import datasets
from module import models

# Read the CSV file
df = datasets.amazon()

# Stratified Sampling
df_sample = datasets.sample(df, 0.2)

# Check the sample dataframe
print(df_sample['main_category'].value_counts(normalize=True))
print(df_sample['main_category'].value_counts(normalize=True))
print(df_sample)

# Save
df_sample.to_csv("data_sample.csv", index=False)