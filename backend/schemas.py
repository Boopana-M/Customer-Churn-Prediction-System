"""
Pydantic schema definitions for FastAPI backend endpoints and model validation.
"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict


class CustomerPredictionInput(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    gender: Literal["Male", "Female"] = Field(..., json_schema_extra={"example": "Female"}, description="Customer gender")
    SeniorCitizen: Literal[0, 1] = Field(..., json_schema_extra={"example": 0}, description="1 if senior citizen, 0 otherwise")
    Partner: Literal["Yes", "No"] = Field(..., json_schema_extra={"example": "No"}, description="Whether customer has a partner")
    Dependents: Literal["Yes", "No"] = Field(..., json_schema_extra={"example": "No"}, description="Whether customer has dependents")
    tenure: int = Field(..., ge=0, le=120, json_schema_extra={"example": 6}, description="Number of months customer has stayed")
    PhoneService: Literal["Yes", "No"] = Field(..., json_schema_extra={"example": "Yes"}, description="Whether customer has phone service")
    MultipleLines: Literal["No", "Yes", "No phone service"] = Field(..., json_schema_extra={"example": "No"}, description="Multiple lines status")
    InternetService: Literal["DSL", "Fiber optic", "No"] = Field(..., json_schema_extra={"example": "Fiber optic"}, description="Internet service provider")
    OnlineSecurity: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "No"}, description="Online security add-on")
    OnlineBackup: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "No"}, description="Online backup add-on")
    DeviceProtection: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "No"}, description="Device protection add-on")
    TechSupport: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "No"}, description="Tech support add-on")
    StreamingTV: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "Yes"}, description="Streaming TV add-on")
    StreamingMovies: Literal["No", "Yes", "No internet service"] = Field(..., json_schema_extra={"example": "No"}, description="Streaming movies add-on")
    Contract: Literal["Month-to-month", "One year", "Two year"] = Field(..., json_schema_extra={"example": "Month-to-month"}, description="Contract duration term")
    PaperlessBilling: Literal["Yes", "No"] = Field(..., json_schema_extra={"example": "Yes"}, description="Paperless billing status")
    PaymentMethod: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)"
    ] = Field(..., json_schema_extra={"example": "Electronic check"}, description="Payment method")
    MonthlyCharges: float = Field(..., ge=0.0, json_schema_extra={"example": 79.85}, description="Monthly amount charged to customer")
    TotalCharges: float = Field(..., ge=0.0, json_schema_extra={"example": 479.10}, description="Total amount charged over tenure")


class PredictionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    prediction: str
    predicted_class: int
    churn_probability: float
    churn_percentage: float
    risk_band: str
    decision_threshold: float
    model_version: str
    key_factors: List[str]


class BatchPredictionInput(BaseModel):
    customers: List[CustomerPredictionInput]


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]
    total_processed: int


class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str
    model_loaded: bool
    model_name: str
    model_version: str
    timestamp: str


class KPISummaryResponse(BaseModel):
    total_customers: int
    churned_customers: int
    retained_customers: int
    churn_rate: float
    churn_percentage: float
    avg_monthly_charges: float
    total_monthly_revenue: float
    churned_monthly_charges: float
    avg_tenure_months: float


class DimensionItem(BaseModel):
    category: str
    total_customers: int
    churned_customers: int
    retained_customers: int
    churn_rate: float
    churn_pct: float
    avg_monthly_charges: float


class ChurnBreakdownResponse(BaseModel):
    dimension: str
    breakdown: List[DimensionItem]
