import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import pickle

# Parameters
# Folder for saving models
saving_folder = "machine_learning/models"
dataset = "machine_learning/data_sample.csv"

# Loading the dataset
df = pd.read_csv(dataset)

# TF-IDF vectorizer
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['name'])

# Label Encoding
le = LabelEncoder()
y = le.fit_transform(df['main_category'])

# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model (Sparse supported)
model = RandomForestClassifier()
print("Started training.")
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
with open(f"{saving_folder}/model_eval.txt", "w") as file:
    file.write(classification_report(y_test, y_pred, target_names=le.classes_))

# Save the model
with open(f'{saving_folder}/model.pkl', 'wb') as f:
    pickle.dump(model, f)