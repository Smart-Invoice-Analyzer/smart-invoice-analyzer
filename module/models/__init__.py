from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.naive_bayes import GaussianNB
from sklearn.naive_bayes import BernoulliNB
from sklearn.naive_bayes import ComplementNB
from sklearn.naive_bayes import CategoricalNB
from pickle import load
    
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

def save_model(model, name="model.pkl"):
    import pickle
    with open(name, 'wb') as f:
        pickle.dump(model, f)

def load_model(path):
    import pickle
    with open(path, 'rb') as f:
        model = pickle.load(f)
    return model