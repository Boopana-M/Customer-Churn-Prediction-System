"""
End-to-end integration and verification suite for Customer Churn Prediction System.
Tests data processing, model loading, pipeline inference, analytics metrics, and API endpoints.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data.prepare_data import load_raw_data, clean_churn_data
from src.models.predict import ChurnPredictor
from src.analytics.metrics import compute_kpi_summary, compute_all_breakdowns
from backend.main import app

client = TestClient(app)


def test_data_pipeline_integrity():
    raw_df = load_raw_data("dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv")
    assert len(raw_df) == 7043
    cleaned_df = clean_churn_data(raw_df)
    assert len(cleaned_df) == 7043
    assert (cleaned_df['TotalCharges'] >= 0).all()
    assert set(cleaned_df['Churn_Binary'].unique()) == {0, 1}


def test_model_predictor_inference():
    predictor = ChurnPredictor()
    sample = {
        "gender": "Female",
        "SeniorCitizen": 0,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 2,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "No",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 79.85,
        "TotalCharges": 159.70
    }
    result = predictor.predict_single(sample)
    assert "churn_probability" in result
    assert 0.0 <= result["churn_probability"] <= 1.0
    assert result["risk_band"] in ["Low Risk", "Moderate Risk", "High Risk"]
    assert len(result["key_factors"]) > 0


def test_analytics_kpi_consistency():
    raw_df = load_raw_data("dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv")
    cleaned_df = clean_churn_data(raw_df)
    kpis = compute_kpi_summary(cleaned_df)
    assert kpis["total_customers"] == 7043
    assert kpis["churned_customers"] == 1869
    assert kpis["retained_customers"] == 5174
    assert kpis["churn_percentage"] == 26.54


def test_api_routes_end_to_end():
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["model_loaded"] is True

    summary = client.get("/api/analytics/summary")
    assert summary.status_code == 200
    assert summary.json()["total_customers"] == 7043

    customers = client.get("/api/customers?page=1&page_size=5")
    assert customers.status_code == 200
    assert len(customers.json()["customers"]) == 5
