"""
Customer Churn Intelligence Platform - FastAPI Backend Application.
Provides RESTful APIs for Churn Prediction, Segment Analytics, and Health Monitoring.
"""
import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import (
    CustomerPredictionInput,
    PredictionResponse,
    BatchPredictionInput,
    BatchPredictionResponse,
    HealthResponse,
    KPISummaryResponse,
    ChurnBreakdownResponse
)
from backend.services.prediction_service import PredictionService
from backend.services.analytics_service import AnalyticsService

app = FastAPI(
    title="Customer Churn Intelligence Platform API",
    description="REST API for predicting customer churn risk and serving enterprise retention analytics.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check():
    """Health check endpoint confirming API status and model loaded status."""
    pred_svc = PredictionService.get_instance()
    info = pred_svc.get_model_info()
    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_name=info["model_name"],
        model_version=info["model_version"],
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/analytics/summary", response_model=KPISummaryResponse, tags=["Analytics"])
def get_analytics_summary():
    """Returns dataset-wide customer retention and revenue KPI metrics."""
    analytics_svc = AnalyticsService.get_instance()
    return analytics_svc.get_kpis()


@app.get("/api/analytics/churn-breakdown", tags=["Analytics"])
def get_churn_breakdown(
    dimension: str = Query(
        "Contract",
        description="Dimension to breakdown churn by (e.g. Contract, InternetService, PaymentMethod, tenure_group)"
    )
):
    """Returns churn distribution and average charges grouped by a specific categorical dimension."""
    analytics_svc = AnalyticsService.get_instance()
    try:
        data = analytics_svc.get_dimension_breakdown(dimension)
        return {"dimension": dimension, "breakdown": data}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/analytics/breakdowns", tags=["Analytics"])
def get_all_breakdowns():
    """Returns all standard dimension breakdowns at once."""
    analytics_svc = AnalyticsService.get_instance()
    return analytics_svc.get_all_breakdowns()


@app.get("/api/analytics/segments", tags=["Analytics"])
def get_segments():
    """Returns multi-dimensional aggregated customer segments from cleaned dataset."""
    analytics_svc = AnalyticsService.get_instance()
    return analytics_svc.get_segments()


@app.get("/api/customers", tags=["Customers"])
def list_customers(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by customer ID"),
    contract: Optional[str] = Query(None, description="Filter by Contract"),
    internet_service: Optional[str] = Query(None, description="Filter by Internet Service"),
    churn_status: Optional[str] = Query(None, description="Filter by Churn status ('Yes', 'No')")
):
    """Returns paginated and filtered historical customer records."""
    analytics_svc = AnalyticsService.get_instance()
    return analytics_svc.get_customers(
        page=page,
        page_size=page_size,
        search=search,
        contract=contract,
        internet_service=internet_service,
        churn_status=churn_status
    )


@app.post("/api/predict", response_model=PredictionResponse, tags=["Machine Learning"])
def predict_customer_churn(customer: CustomerPredictionInput):
    """Calculates churn probability and risk tier for a single customer profile."""
    try:
        pred_svc = PredictionService.get_instance()
        result = pred_svc.predict_one(customer.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction failed: {str(e)}")


@app.post("/api/predict/batch", response_model=BatchPredictionResponse, tags=["Machine Learning"])
def predict_batch_churn(payload: BatchPredictionInput):
    """Calculates churn predictions for a batch of customer profiles."""
    try:
        pred_svc = PredictionService.get_instance()
        data_list = [c.model_dump() for c in payload.customers]
        results = pred_svc.predict_many(data_list)
        return BatchPredictionResponse(
            predictions=results,
            total_processed=len(results)
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Batch prediction failed: {str(e)}")


@app.get("/api/model/metadata", tags=["Machine Learning"])
def get_model_metadata():
    """Returns champion model metrics, top feature importances, and model comparisons."""
    pred_svc = PredictionService.get_instance()
    return pred_svc.get_model_info()
