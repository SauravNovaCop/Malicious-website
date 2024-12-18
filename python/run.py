import numpy as np
import feature_extract
import sys
import joblib
import torch
import torch.nn as nn
import json

# ResMLP Model Definition
class ResMLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_classes):
        super(ResMLP, self).__init__()
        self.token_mixing = nn.Linear(input_dim, hidden_dim)
        self.channel_mixing = nn.Linear(hidden_dim, hidden_dim)
        self.residual = nn.Linear(input_dim, hidden_dim)
        self.classifier = nn.Linear(hidden_dim, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        token_out = self.relu(self.token_mixing(x))
        channel_out = self.relu(self.channel_mixing(token_out))
        residual_out = channel_out + self.residual(x)
        out = self.classifier(residual_out)
        return out

# Load Models
try:
    random_forest_model = joblib.load('python/models/random_forest_model.pkl')
    nb_model = joblib.load('python/models/nb_model.pkl')
    label_encoder = joblib.load('python/models/label_encoder.pkl')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    resmlp_model = ResMLP(input_dim=30, hidden_dim=64, num_classes=4) 
    resmlp_model.load_state_dict(torch.load('python/models/resmlp_model.pth', map_location=device,weights_only=True))
    resmlp_model.eval()
except Exception as e:
    print(json.dumps({"error": f"Error loading models: {e}"}))
    sys.exit(1)

# Function to predict label
def predict_label(encoded_label):
    return label_encoder.inverse_transform([encoded_label])[0]

# Predict URL Safety
def predict_url_safety(url):
    query = feature_extract.FeatureExtraction(url=url)

    all_features = query.getFeaturesList()  
    input_arr_full = np.array(all_features).reshape(1, -1)

    feature_values_top = [query.getFeaturesList() [i] for i in [2, 17, 6, 18, 14, 15, 9, 28, 1, 5, 22]]
    input_arr_top = np.array(feature_values_top).reshape(1, -1)

    rf_probs = random_forest_model.predict_proba(input_arr_full)[0]
    rf_prediction = np.argmax(rf_probs)
    rf_label = predict_label(rf_prediction)
    rf_malicious_percent = rf_probs[1] * 100

    nb_probs = nb_model.predict_proba(input_arr_top)[0]
    nb_prediction = np.argmax(nb_probs)
    nb_label = predict_label(nb_prediction)
    nb_malicious_percent = nb_probs[1] * 100

    with torch.no_grad():
        input_tensor = torch.tensor(input_arr_full, dtype=torch.float32).to(device)
        resmlp_output = resmlp_model(input_tensor)
        resmlp_probs = torch.nn.Softmax(dim=1)(resmlp_output).cpu().numpy()[0]
        resmlp_prediction = np.argmax(resmlp_probs)
        resmlp_label = predict_label(resmlp_prediction)
        resmlp_malicious_percent = resmlp_probs[1] * 100

    return {
        "features": all_features,
        "random_forest": {
            "prediction": rf_label,
            "malicious_percent": int(rf_malicious_percent)
        },
        "naive_bayes": {
            "prediction": nb_label,
            "malicious_percent": int(nb_malicious_percent)
        },
        "resmlp": {
            "prediction": resmlp_label,
            "malicious_percent": int(resmlp_malicious_percent)
        }
    }

# Main Execution
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide a URL as an argument"}))
        sys.exit(1)
    
    url = sys.argv[1]
    results = predict_url_safety(url)
    print(json.dumps(results, indent=4))