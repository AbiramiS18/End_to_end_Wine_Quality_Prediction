from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI(title="Wine Quality Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this if frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths for model and scaler
scaler_path = os.path.join("models", "scaler.pkl")
model_path = os.path.join("models", "final_model.pkl")

# Ensure both model and scaler exist
if not os.path.exists(scaler_path) or not os.path.exists(model_path):
    raise RuntimeError("Model or scaler file not found. Please run the training pipeline.")

# Load model and scaler
scaler = joblib.load(scaler_path)
model = joblib.load(model_path)

# Input schema for prediction
class WineFeatures(BaseModel):
    fixed_acidity: float
    volatile_acidity: float
    citric_acid: float
    residual_sugar: float
    chlorides: float
    free_sulfur_dioxide: float
    total_sulfur_dioxide: float
    density: float
    pH: float
    sulphates: float
    alcohol: float
    type: str  # "red" or "white"

# Preprocess function
def preprocess_input(input_df: pd.DataFrame) -> pd.DataFrame:
    # Convert wine type to numerical: red → 0, white → 1
    if "type" in input_df.columns:
        input_df["type"] = input_df["type"].map({"red": 0, "white": 1})
    return input_df

# Predict endpoint
@app.post("/predict")
def predict_quality(features: WineFeatures):
    try:
        # Map input to original training feature names
        input_dict = {
            "fixed acidity": features.fixed_acidity,
            "volatile acidity": features.volatile_acidity,
            "citric acid": features.citric_acid,
            "residual sugar": features.residual_sugar,
            "chlorides": features.chlorides,
            "free sulfur dioxide": features.free_sulfur_dioxide,
            "total sulfur dioxide": features.total_sulfur_dioxide,
            "density": features.density,
            "pH": features.pH,
            "sulphates": features.sulphates,
            "alcohol": features.alcohol,
            "type": 0 if features.type.lower() == "red" else 1  # Convert to numeric
        }

        # Ensure feature order matches training
        columns_order = [
            "fixed acidity", "volatile acidity", "citric acid", "residual sugar",
            "chlorides", "free sulfur dioxide", "total sulfur dioxide", "density",
            "pH", "sulphates", "alcohol", "type"
        ]

        input_df = pd.DataFrame([input_dict], columns=columns_order)

        # Scale and predict
        scaled_input = scaler.transform(input_df)
        prediction = model.predict(scaled_input)

        return {"prediction": int(prediction[0])}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpoint to retrieve raw data
@app.get("/data")
def get_data():
    try:
        data_path = os.path.join(os.path.dirname(__file__), "data", "winequalityN.csv")
        df = pd.read_csv(data_path)

        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)

        return JSONResponse(content=df.to_dict(orient="records"))
    except FileNotFoundError:
        return JSONResponse(status_code=404, content={"detail": "winequalityN.csv not found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Internal error: {str(e)}"})

# Endpoint for metrics
@app.get("/metrics")
def get_metrics():
    try:
        data_path = os.path.join(os.path.dirname(__file__), "data", "winequalityN.csv")
        df = pd.read_csv(data_path)

        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)

        # Label mapping for quality categories
        def label_quality(q):
            if q <= 5:
                return "Low"
            elif q == 6:
                return "Medium"
            else:
                return "High"

        df["quality_label"] = df["quality"].apply(label_quality)

        alcohol_by_quality = df.groupby("quality_label")["alcohol"].mean().reset_index()
        sulphates_by_quality = df.groupby("quality_label")["sulphates"].mean().reset_index()
        volatile_by_quality = df.groupby("quality_label")["volatile acidity"].mean().reset_index()
        quality_counts = df["quality_label"].value_counts(normalize=True).reset_index()
        quality_counts.columns = ["quality_label", "percentage"]
        quality_counts["percentage"] *= 100

        return {
            "alcohol_by_quality": alcohol_by_quality.to_dict(orient="records"),
            "sulphates_by_quality": sulphates_by_quality.to_dict(orient="records"),
            "volatile_by_quality": volatile_by_quality.to_dict(orient="records"),
            "quality_distribution": quality_counts.to_dict(orient="records"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
