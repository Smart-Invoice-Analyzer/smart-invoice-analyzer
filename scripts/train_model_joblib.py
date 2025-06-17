from sklearn.linear_model import LogisticRegression
from joblib import dump, load

def train_and_eval(x, y, classes, model=None):
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import classification_report
    from numpy import array
    # If the model is not given, use Logistic Regression
    # Had to change from 'if not model' to 'if model is None' because Random Forest error
    if model is None:
        model = LogisticRegression()
    # Train/test split
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    # Fit the model
    model.fit(x_train, y_train)
    # Evalulation
    y_pred = model.predict(x_test)
    print(classification_report(y_test, y_pred, target_names=array(classes)))
    return model

def save_model(model, name="model.joblib"):
    dump(model, name)

def load_model(path):
    return load(path)

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
import nltk
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer

def main():
    nltk.download('punkt')
    nltk.download('stopwords')

    df = pd.read_csv("./datasets/data.csv")

    print("Dataset shape:", df.shape)

    df["name"] = df["name"].str.replace(r'\d+', '', regex=True)
    df["name"] = df["name"].str.replace(r'[^\w\s]', '', regex=True)

    def remove_stopwords(text):
        if pd.isna(text):
            return text
        stop_words = set(stopwords.words('english'))
        tokenizer = RegexpTokenizer(r'\w+')
        word_tokens = tokenizer.tokenize(text.lower())
        filtered_text = [word for word in word_tokens if word not in stop_words]
        return ' '.join(filtered_text)

    df["name"] = df["name"].apply(remove_stopwords)

    cv = CountVectorizer()
    X = cv.fit_transform(df["name"])

    le = LabelEncoder()
    y = le.fit_transform(df["main_category"])

    lr = LogisticRegression(max_iter=1000)

    lr = train_and_eval(X, y, classes=le.classes_, model=lr)

    save_model(lr, "models/lr_full.joblib")
    save_model(cv, "models/vectorizer.joblib")
    save_model(le, "models/labelencoder.joblib")

if __name__ == "__main__":
    main()
