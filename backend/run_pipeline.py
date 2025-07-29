# run_pipeline.py

import pandas as pd
import joblib
import os
from collections import Counter

from src.preprocess import preprocess
from src.model import train_model
from src.evaluate import evaluate_model
from src.explain import shap_explain

def main():
    # Step 1: Load and preprocess data
    df = pd.read_csv("data/winequalityN.csv")
    X_train, X_test, y_train, y_test, scaler = preprocess(df)

    # Show class balance
    print("Class distribution in training set:", Counter(y_train))

    # Step 2: Train the model directly on original data (no SMOTE)
    model = train_model(X_train, y_train, model_type='rf')

    # Step 3: Evaluate the model on test set
    report = evaluate_model(model, X_test, y_test)
    print("Overall Accuracy:", report['accuracy'])
    print("Classification Report:", report['report'])
    print('Confusion Matrix:\n', report['confusion_matrix'])


    # Step 4: SHAP explanation on a sample of test data
    X_sample = X_test[:100]  # Limit sample size for SHAP speed
    shap_explain(model, X_sample)

    # Step 5: Save the trained model and scaler
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/final_model.pkl")
    joblib.dump(scaler, "models/scaler.pkl")
    print("Scaler saved to models/scaler.pkl")
    print("Model saved to models/final_model.pkl")

if __name__ == "__main__":
    main()

