# src/explain.py
import shap
import matplotlib.pyplot as plt
import os

def shap_explain(model, X_sample):

    # Choose appropriate explainer
    model_name = model.__class__.__name__.lower()
    
    if "xgb" in model_name:
        explainer = shap.TreeExplainer(model)
    elif "randomforest" in model_name:
        explainer = shap.TreeExplainer(model)
    else:
        raise ValueError(f"Unsupported model type: {model_name}")

    # Compute SHAP values (limit sample size for speed)
    shap_values = explainer.shap_values(X_sample)

