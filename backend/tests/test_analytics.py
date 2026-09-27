"""
Unit tests for analytics, breakdowns, segments, and customer listing endpoints.
"""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_analytics_summary():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_customers"] == 7043
    assert data["churned_customers"] == 1869
    assert data["retained_customers"] == 5174
    assert 26.0 <= data["churn_percentage"] <= 27.0


def test_churn_breakdown_contract():
    response = client.get("/api/analytics/churn-breakdown?dimension=Contract")
    assert response.status_code == 200
    data = response.json()
    assert data["dimension"] == "Contract"
    assert len(data["breakdown"]) == 3


def test_churn_breakdown_invalid_dimension():
    response = client.get("/api/analytics/churn-breakdown?dimension=NonExistentColumn")
    assert response.status_code == 400


def test_all_breakdowns():
    response = client.get("/api/analytics/breakdowns")
    assert response.status_code == 200
    data = response.json()
    assert "Contract" in data
    assert "InternetService" in data
    assert "PaymentMethod" in data


def test_get_customers_pagination():
    response = client.get("/api/customers?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] == 7043
    assert len(data["customers"]) == 10
    assert data["page"] == 1


def test_get_customers_search():
    response = client.get("/api/customers?search=7590-VHVEG")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 1
    assert data["customers"][0]["customerID"] == "7590-VHVEG"


def test_model_metadata():
    response = client.get("/api/model/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "metrics" in data
