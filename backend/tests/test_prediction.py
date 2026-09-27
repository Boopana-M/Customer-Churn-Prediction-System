"""
Unit tests for single and batch churn prediction endpoints.
"""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

SAMPLE_CUSTOMER = {
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "No",
    "Dependents": "No",
    "tenure": 3,
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
    "MonthlyCharges": 85.50,
    "TotalCharges": 256.50
}


def test_predict_single_valid():
    response = client.post("/api/predict", json=SAMPLE_CUSTOMER)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "churn_probability" in data
    assert 0.0 <= data["churn_probability"] <= 1.0
    assert data["risk_band"] in ["Low Risk", "Moderate Risk", "High Risk"]
    assert isinstance(data["key_factors"], list)


def test_predict_single_invalid_missing_fields():
    invalid_payload = {"gender": "Male"}  # missing tenure, Contract, etc.
    response = client.post("/api/predict", json=invalid_payload)
    assert response.status_code == 422  # Unprocessable Entity / validation error


def test_predict_single_invalid_category():
    invalid_payload = SAMPLE_CUSTOMER.copy()
    invalid_payload["Contract"] = "Infinite Years"
    response = client.post("/api/predict", json=invalid_payload)
    assert response.status_code == 422


def test_predict_batch():
    batch_payload = {"customers": [SAMPLE_CUSTOMER, SAMPLE_CUSTOMER]}
    response = client.post("/api/predict/batch", json=batch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_processed"] == 2
    assert len(data["predictions"]) == 2
