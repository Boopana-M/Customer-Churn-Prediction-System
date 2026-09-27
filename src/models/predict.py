"""
Prediction inference module for Customer Churn Prediction.
Loads serialized pipeline and performs single or batch customer risk scoring.
"""
import sys
import json
from pathlib import Path
from typing import Dict, Any, Union, List
import pandas as pd
import joblib

# Ensure project root in sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


class ChurnPredictor:
    """Predictor class for loading pipeline and running inference."""

    def __init__(
        self,
        model_path: str = "artifacts/churn_pipeline.joblib",
        metadata_path: str = "artifacts/model_metadata.json"
    ):
        m_path = Path(model_path)
        meta_path = Path(metadata_path)

        if not m_path.exists():
            raise FileNotFoundError(f"Model pipeline not found at: {m_path.resolve()}")

        self.pipeline = joblib.load(m_path)
        self.metadata = {}
        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

        self.threshold = self.metadata.get("decision_threshold", 0.50)
        self.model_version = self.metadata.get("model_version", "1.0.0")

    def _assign_risk_band(self, probability: float) -> str:
        if probability < 0.30:
            return "Low Risk"
        elif probability < 0.60:
            return "Moderate Risk"
        else:
            return "High Risk"

    def predict_single(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs prediction on a single customer dictionary.
        """
        df = pd.DataFrame([customer_data])
        # Ensure TotalCharges is numeric
        if 'TotalCharges' in df.columns:
            df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce').fillna(0.0)

        prob = float(self.pipeline.predict_proba(df)[:, 1][0])
        pred_class = int(prob >= self.threshold)
        risk_band = self._assign_risk_band(prob)

        # Factor insights
        key_factors = []
        if df['Contract'].iloc[0] == "Month-to-month":
            key_factors.append("Month-to-month contract elevates churn risk.")
        if df['tenure'].iloc[0] <= 12:
            key_factors.append("Early customer tenure (< 12 months) has high churn likelihood.")
        if df['InternetService'].iloc[0] == "Fiber optic":
            key_factors.append("Fiber optic subscription with elevated charges increases churn exposure.")
        if df['PaymentMethod'].iloc[0] == "Electronic check":
            key_factors.append("Electronic check payment exhibits higher historical churn.")
        if df['TechSupport'].iloc[0] == "No":
            key_factors.append("Absence of Tech Support increases churn risk.")

        return {
            "prediction": "Churn" if pred_class == 1 else "Retained",
            "predicted_class": pred_class,
            "churn_probability": round(prob, 4),
            "churn_percentage": round(prob * 100, 2),
            "risk_band": risk_band,
            "decision_threshold": self.threshold,
            "model_version": self.model_version,
            "key_factors": key_factors
        }

    def predict_batch(self, customers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Runs batch predictions on a list of customer records.
        """
        return [self.predict_single(cust) for cust in customers]
