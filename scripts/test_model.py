import pickle

# Load saved objects
with open('models/lr_full.pkl', 'rb') as f:
    model = pickle.load(f)

with open('models/vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('models/labelencoder.pkl', 'rb') as f:
    le = pickle.load(f)

# Example input text
input_text = ["jeans"]

# Vectorize input text exactly as during training
X_input = vectorizer.transform(input_text)

# Predict label index
predicted_idx = model.predict(X_input)

# Convert label index back to original category
predicted_label = le.inverse_transform(predicted_idx)

print("Predicted category:", predicted_label[0])
