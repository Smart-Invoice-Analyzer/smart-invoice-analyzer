from sklearn.svm import SVC
from pickle import load

def load_svc(kernel:str="linear") -> SVC:
    if kernel == "linear":
        with open("./categorization/models/svc-linear.pkl", "rb") as file:
            model = load(file)
            return model
    else: 
        return None