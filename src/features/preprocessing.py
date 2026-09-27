"""
Feature engineering and preprocessing pipeline for Customer Churn Prediction.
Builds ColumnTransformers and Scikit-Learn pipelines to prevent data leakage.
"""
from typing import List, Tuple
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

# Define canonical model feature lists
NUMERIC_FEATURES: List[str] = [
    "tenure",
    "MonthlyCharges",
    "TotalCharges"
]

CATEGORICAL_FEATURES: List[str] = [
    "gender",
    "SeniorCitizen",
    "Partner",
    "Dependents",
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies",
    "Contract",
    "PaperlessBilling",
    "PaymentMethod"
]

ALL_MODEL_FEATURES: List[str] = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs the standard Scikit-learn ColumnTransformer.
    - Numeric pipeline: Median imputation + StandardScaler
    - Categorical pipeline: Most frequent imputation + OneHotEncoder
    """
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder="drop"
    )
    return preprocessor


def get_feature_names(fitted_preprocessor: ColumnTransformer) -> List[str]:
    """Extracts output feature names from a fitted ColumnTransformer."""
    feature_names = []
    # Numeric features
    feature_names.extend(NUMERIC_FEATURES)

    # Categorical one-hot features
    cat_transformer = fitted_preprocessor.named_transformers_["cat"]
    onehot = cat_transformer.named_steps["onehot"]
    cat_names = onehot.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    feature_names.extend(cat_names)
    return feature_names
