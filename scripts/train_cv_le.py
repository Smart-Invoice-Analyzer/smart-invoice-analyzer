from module import models
from module import datasets
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder

# Fitting Count Vectorizer
df = datasets.amazon()
cv = CountVectorizer()
X = cv.fit_transform(df["name"])
print("Count Vectorizer fit successfully.")
models.save_model(cv,"vectorizer.pkl")

# Fitting Label Encoder
le = LabelEncoder()
y = le.fit_transform(df["main_category"])
print("Label Encoder fit successfully.")
models.save_model(le,"labelencoder.pkl")