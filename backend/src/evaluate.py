# src/evaluate.py

from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the trained model using accuracy, classification report,
    and confusion matrix. Optionally adjusts for offset in label encoding.
    """
    y_pred = model.predict(X_test)

    # Accuracy, classification report, and confusion matrix
    acc = accuracy_score(y_test, y_pred)
    cls_report = classification_report(
        y_test, y_pred, output_dict=True
    )
    cm = confusion_matrix(y_test, y_pred)

    return {
        "accuracy": acc,
        "report": cls_report,
        "confusion_matrix": cm
    }
