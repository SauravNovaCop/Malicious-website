import numpy as np
import feature_extract
import sys
import joblib
import torch
import torch.nn as nn
import json

# ResMLP Model Definition
class ResMLP(nn.Module):
    def __init__(self, input_size, num_classes):
        super(ResMLP, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.fc2 = nn.Linear(128, 128)
        self.fc3 = nn.Linear(128, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x):
        out = self.relu(self.fc1(x))
        residual = out
        out = self.relu(self.fc2(out)) + residual
        out = self.dropout(out)
        out = self.fc3(out)
        return out

# Load models
try:
    random_forest_model = joblib.load('python/models/random_forest.pkl')
    nb_model = joblib.load('python/models/naive_bayes.pkl')
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    resmlp_model = ResMLP(input_size=30, num_classes=2)  # Fixed parameter names
    resmlp_model.load_state_dict(torch.load('python/models/resmlp.pth', map_location=device))
    resmlp_model.to(device)
    resmlp_model.eval()
except Exception as e:
    print(json.dumps({"error": f"Error loading models: {e}"}))
    sys.exit(1)

# Predict URL Safety
def predict_url_safety(url):
    query = feature_extract.FeatureExtraction(url=url)
    all_features = query.getFeaturesList()
    input_arr_full = np.array(all_features).reshape(1, -1)

    # Random Forest Prediction
    rf_probs = random_forest_model.predict_proba(input_arr_full)[0]
    rf_prediction = 1 if np.argmax(rf_probs) == 1 else -1  
    rf_malicious_percent = rf_probs[1] * 100

    # Naïve Bayes Prediction
    nb_probs = nb_model.predict_proba(input_arr_full)[0]
    nb_prediction = 1 if np.argmax(nb_probs) == 1 else -1  
    nb_malicious_percent = nb_probs[1] * 100

    # ResMLP Prediction
    with torch.no_grad():
        input_tensor = torch.tensor(input_arr_full, dtype=torch.float32).to(device)
        resmlp_output = resmlp_model(input_tensor)
        resmlp_probs = torch.nn.functional.softmax(resmlp_output, dim=1).cpu().numpy()[0]
        resmlp_prediction = int(np.argmax(resmlp_probs))  # 0 for Phishing, 1 for Benign
        resmlp_malicious_percent = resmlp_probs[1] * 100

    return {
        "features": all_features,
        "random_forest": {
            "prediction": rf_prediction == 1 and "Malicious" or "Benign",
            "malicious_percent": int(rf_malicious_percent)
        },
        "naive_bayes": {
            "prediction": nb_prediction == 1 and "Malicious" or "Benign",
            "malicious_percent": int(nb_malicious_percent)
        },
        "resmlp": {
            "prediction": resmlp_prediction == 1 and "Benign" or "Malicious",
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
