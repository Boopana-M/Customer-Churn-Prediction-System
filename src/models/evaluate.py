"""
Model evaluation module for Customer Churn Prediction.
Calculates comprehensive classification metrics, confusion matrices, and ROC/PR statistics.
"""
from typing import Dict, Any
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report
)


def evaluate_model(model, X_test: pd.DataFrame, y_test: pd.Series, threshold: float = 0.5) -> Dict[str, Any]:
    """
    Evaluates a trained pipeline on test data using custom decision threshold.
    """
    # Get probabilities
    if hasattr(model, "predict_proba"):
        y_probs = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, "decision_function"):
        y_probs = model.decision_function(X_test)
    else:
        y_probs = model.predict(X_test)

    # Threshold-based predictions
    y_pred = (y_probs >= threshold).astype(int)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_probs))
    avg_prec = float(average_precision_score(y_test, y_probs))

    cm = confusion_matrix(y_test, y_pred)
    # cm: [[TN, FP], [FN, TP]]
    tn, fp, fn, tp = [int(v) for v in cm.ravel()]

    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(avg_prec, 4),
        "confusion_matrix": {
            "true_negatives": tn,
            "false_positives": fp,
            "false_negatives": fn,
            "true_positives": tp
        },
        "test_records": int(len(y_test)),
        "decision_threshold": threshold
    }
