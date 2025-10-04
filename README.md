# Malicious Website Detection

> **Python version:** `3.10.12` (please create your virtual environment with this exact interpreter)

This file documents a small ML pipeline for detecting malicious websites from 30 URL/website features. It includes: feature mapping, CSV input format, a recommended Python environment, install steps, a quick training & inference example, and recommended evaluation approach.

---

# 1 — Feature list & index mapping

The model expects features in this exact order (index 0 → 29). Use the same order for CSV columns / numpy arrays / pandas DataFrame columns.

1. `Using IP`
2. `Long URL`
3. `Short URL`
4. `Symbol @`
5. `Redirecting //`
6. `Prefix Suffix -`
7. `SubDomains`
8. `HTTPS`
9. `Domain Reg Length`
10. `Favicon`
11. `Non-Std Port`
12. `HTTPS Domain URL`
13. `Request URL`
14. `Anchor URL`
15. `Links In Script Tags`
16. `Server Form Handler`
17. `Info Email`
18. `Abnormal URL`
19. `Website Forwarding`
20. `Status Bar Customization`
21. `Disable Right Click`
22. `Using Popup Window`
23. `Iframe Redirection`
24. `Age of Domain`
25. `DNS Recording`
26. `Website Traffic`
27. `PageRank`
28. `Google Index`
29. `Links Pointing To Page`
30. `Stats Report`

> **Important:** Keep the same order and names in headers for reproducibility.

---

# 2 — Suggested data types (recommended)

- Binary / boolean (0/1): `Using IP`, `Short URL`, `Symbol @`, `Redirecting //`, `Prefix Suffix -`, `Favicon` (0 if missing, 1 if present), `Non-Std Port`, `HTTPS Domain URL`, `Request URL`, `Anchor URL`, `Links In Script Tags`, `Server Form Handler`, `Info Email`, `Abnormal URL`, `Website Forwarding`, `Status Bar Customization`, `Disable Right Click`, `Using Popup Window`, `Iframe Redirection`, `DNS Recording`, `Google Index` (1 if indexed), `Stats Report` (1 if available)
- Numeric (integer / float): `SubDomains` (count of subdomains), `Domain Reg Length` (days), `Age of Domain` (days), `Website Traffic` (estimated visits), `PageRank` (float), `Links Pointing To Page` (count)
- `HTTPS` — can be binary (1 if `https://`, 0 otherwise) or tri-state if you want (0/1)

You should normalize numeric features (e.g., log-transform traffic, scale counts) during preprocessing.

---

# 3 — Example CSV format

Filename: `data/features.csv`

Header (exact order recommended):

```csv
Using IP,Long URL,Short URL,Symbol @,Redirecting //,Prefix Suffix -,SubDomains,HTTPS,Domain Reg Length,Favicon,Non-Std Port,HTTPS Domain URL,Request URL,Anchor URL,Links In Script Tags,Server Form Handler,Info Email,Abnormal URL,Website Forwarding,Status Bar Customization,Disable Right Click,Using Popup Window,Iframe Redirection,Age of Domain,DNS Recording,Website Traffic,PageRank,Google Index,Links Pointing To Page,Stats Report,label
```

Example row:

```csv
0,1,0,0,1,0,2,1,365,1,0,1,0,0,0,0,0,1,0,0,0,0,0,730,1,12345,0.2,1,67,1,malicious
```

- `label` column: use `malicious` / `benign` or `1` / `0`.

---

# 4 — Environment (Python 3.10.12)

Create a virtual environment using Python `3.10.12`:

```bash
# assuming you have python3.10.12 installed and available as python3.10
python3.10 -m venv .venv
source .venv/bin/activate   # macOS / Linux
# or on Windows:
# .venv\Scripts\activate

python --version  # should show Python 3.10.12
pip install --upgrade pip
```

---

# 5 — requirements.txt (suggested)

```text
pandas>=1.5
numpy>=1.23
scikit-learn>=1.1
xgboost>=1.7
joblib>=1.2
```

Install:

```bash
pip install -r requirements.txt
```

---

# 6 — Minimal training script (`train.py`)

```python
"""
train.py
- Python 3.10.12
- Reads CSV, trains a classifier, saves model to disk
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib

FEATURE_ORDER = [
    "Using IP","Long URL","Short URL","Symbol @","Redirecting //","Prefix Suffix -",
    "SubDomains","HTTPS","Domain Reg Length","Favicon","Non-Std Port","HTTPS Domain URL",
    "Request URL","Anchor URL","Links In Script Tags","Server Form Handler","Info Email",
    "Abnormal URL","Website Forwarding","Status Bar Customization","Disable Right Click",
    "Using Popup Window","Iframe Redirection","Age of Domain","DNS Recording","Website Traffic",
    "PageRank","Google Index","Links Pointing To Page","Stats Report"
]

def load_data(path="data/features.csv"):
    df = pd.read_csv(path)
    # Expect 'label' column with 1=malicious, 0=benign or 'malicious'/'benign'
    if df['label'].dtype == object:
        df['label'] = df['label'].map({'benign':0,'malicious':1}).fillna(df['label'])
    X = df[FEATURE_ORDER].values
    y = df['label'].astype(int).values
    return X, y

def main():
    X, y = load_data()
    # Simple train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Scale numeric features: here we'll scale all features (binary features unaffected)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Classifier
    clf = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
    clf.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = clf.predict(X_test_scaled)
    y_proba = clf.predict_proba(X_test_scaled)[:,1]
    print(classification_report(y_test, y_pred))
    try:
        print("ROC AUC:", roc_auc_score(y_test, y_proba))
    except Exception:
        pass

    # Save model + scaler
    joblib.dump({'model': clf, 'scaler': scaler, 'features': FEATURE_ORDER}, 'malicious_detector.joblib')
    print("Saved malicious_detector.joblib")

if __name__ == "__main__":
    main()
```

---

# 7 — Minimal inference script (`predict.py`)

```python
"""
predict.py
- Loads saved artifact and runs inference on new rows (CSV or single example)
"""
import pandas as pd
import joblib
import numpy as np

MODEL_PATH = "malicious_detector.joblib"

def load_model(path=MODEL_PATH):
    obj = joblib.load(path)
    return obj['model'], obj['scaler'], obj['features']

def predict_from_row(row_dict):
    model, scaler, features = load_model()
    # Build array in required order
    x = np.array([row_dict[f] for f in features], dtype=float).reshape(1, -1)
    x_scaled = scaler.transform(x)
    prob = model.predict_proba(x_scaled)[0,1]
    label = model.predict(x_scaled)[0]
    return {'label': int(label), 'probability_malicious': float(prob)}

if __name__ == "__main__":
    # Example
    sample = {
        "Using IP":0, "Long URL":1, "Short URL":0, "Symbol @":0, "Redirecting //":1, "Prefix Suffix -":0,
        "SubDomains":2, "HTTPS":1, "Domain Reg Length":365, "Favicon":1, "Non-Std Port":0, "HTTPS Domain URL":1,
        "Request URL":0, "Anchor URL":0, "Links In Script Tags":0, "Server Form Handler":0, "Info Email":0,
        "Abnormal URL":1, "Website Forwarding":0, "Status Bar Customization":0, "Disable Right Click":0,
        "Using Popup Window":0, "Iframe Redirection":0, "Age of Domain":730, "DNS Recording":1, "Website Traffic":12345,
        "PageRank":0.2, "Google Index":1, "Links Pointing To Page":67, "Stats Report":1
    }
    res = predict_from_row(sample)
    print(res)
```

---

# 8 — Training tips & model selection

- Class imbalance: malicious sites are often rarer than benign. Use `class_weight='balanced'` or resampling (SMOTE) as needed.
- Evaluation metrics: focus on **recall** (catch malicious sites) and **ROC AUC**. Also monitor precision to keep false positives reasonable.
- Try algorithms: `RandomForest`, `XGBoost`, `LightGBM` for tabular features.
- Feature importance: check `clf.feature_importances_` to see which features help most.
- Logging & monitoring: keep a hold-out test set and/or time-based split if data is temporal.

---

# 9 — Feature extraction & automation

This repo assumes you already have a pipeline that extracts the 30 features from URLs/domains and writes them in the expected order. Typical extraction steps:

- `Using IP`: does hostname parse to an IP literal? (1/0)
- `Long URL`: length > threshold (e.g., 75 chars)
- `Short URL`: known shortener domain (bit.ly, t.co, tinyurl)
- `Symbol @`: presence of `@` in URL
- `Redirecting //`: more than one '//' or `//` after protocol
- `Prefix Suffix -`: hyphen in domain
- `SubDomains`: count of subdomains
- `HTTPS`: whether it uses TLS
- `Domain Reg Length`: registration length (from WHOIS, days)
- `Favicon`: whether domain has an accessible favicon
- `Non-Std Port`: presence of port not 80/443
- `HTTPS Domain URL`: mixed-content or mismatched host vs. certificate domain
- `Request URL`, `Anchor URL`, `Links In Script Tags`: ratio of external requests/anchors/scripts linking to other domains
- `Server Form Handler`: form action points to external domain
- `Info Email`: presence of `mailto:` or email in page
- `Abnormal URL`: anomalies in URL structure (heuristic)
- `Website Forwarding`: meta refresh or JS redirects
- `Status Bar Customization`, `Disable Right Click`, `Using Popup Window`, `Iframe Redirection`: JS-based behaviors often used by phishing
- `Age of Domain`: domain age in days (WHOIS)
- `DNS Recording`: presence/absence or TTL anomalies
- `Website Traffic`: Alexa/estimated visits (log scale recommended)
- `PageRank`: if available
- `Google Index`: whether the site is indexed (0/1)
- `Links Pointing To Page`: backlink count
- `Stats Report`: presence of analytics/reporting services

(Adapt extraction rules to what data sources you have — WHOIS, passive DNS, crawled HTML.)

---

# 10 — Security & privacy

- Don't crawl or scan websites you are not allowed to. Respect `robots.txt` and legal limits.
- When using third-party APIs (WHOIS, traffic estimates), ensure proper keys and rate limits.
- Store any scraped content securely; treat PII carefully.

---

# 11 — Next steps & recommendations

- Build a robust feature extractor to reliably compute the 30 features.
- Create an automated pipeline: `extract -> featurize -> predict -> log`.
- Maintain a labeled dataset and periodically retrain the model.
- For deployment, wrap `predict.py` behind a REST API (FastAPI) or serverless function, and ensure near-real-time inference constraints.

---

# 12 — Quick checklist

- [ ] Use Python `3.10.12` virtual environment
- [ ] Install packages from `requirements.txt`
- [ ] Prepare `data/features.csv` with header matching `FEATURE_ORDER`
- [ ] Run `python train.py`
- [ ] Test `python predict.py` with sample input
- [ ] Validate model on separate hold-out data

---

If you want, I can also:

- generate a `Dockerfile` that pins Python 3.10.12 and installs requirements,
- produce a FastAPI wrapper for the predictor,
- or create a small Next.js front-end page that calls the FastAPI to demonstrate predictions.

Which (if any) of those would you like added into the repo now?
