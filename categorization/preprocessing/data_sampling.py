import pandas as pd
from sklearn.model_selection import train_test_split

# CSV dosyasını oku
df = pd.read_csv("machine_learning/data.csv")

# Stratified Sampling: Yüzde 5'lik oransal örnekleme
_, df_sample = train_test_split(df, 
                                test_size=0.05, 
                                stratify=df['main_category'], 
                                random_state=42)

# Örneklenmiş veriyi kontrol et

print(df_sample['main_category'].value_counts(normalize=True))
print(df['main_category'].value_counts(normalize=True))

# Gerekirse kaydet
df_sample.to_csv("machine_learning/data_sample.csv", index=False)