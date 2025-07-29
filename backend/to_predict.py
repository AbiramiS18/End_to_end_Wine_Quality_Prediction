# predict_single.py

import numpy as np
import joblib

# 1. Load model and scaler
model = joblib.load("models/final_model.pkl")
scaler = joblib.load("models/scaler.pkl")  

# 2. New wine sample (must be 11 features)
to_predict = np.array([13.7, 0.415, 0.68, 2.9, 0.085, 17, 43, 1.0014, 3.06, 0.8, 10,1])
reshaped_data = to_predict.reshape(1, -1)

# 3. Scale it
scaled_data = scaler.transform(reshaped_data)

# 4. Predict
predicted_class = model.predict(scaled_data)[0]
wine_quality = predicted_class + 3  # because classes were shifted by -3 during training

print(f"Predicted Wine Quality: {wine_quality}")
