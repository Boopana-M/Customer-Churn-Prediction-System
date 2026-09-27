"""
Metrics and Analytics Engine for Customer Churn Platform.
Calculates standardized KPI summaries, breakdowns, and segment performance.
"""
from typing import Dict, Any, List
import pandas as pd
import numpy as np


def compute_kpi_summary(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes overall summary KPIs.
    """
    total_customers = int(len(df))
    churned_series = df['Churn'].str.strip().str.lower() == 'yes'
    churned_customers = int(churned_series.sum())
    retained_customers = total_customers - churned_customers
    churn_rate = round(churned_customers / total_customers, 4) if total_customers > 0 else 0.0

    avg_monthly_charges = round(float(df['MonthlyCharges'].mean()), 2)
    total_monthly_revenue = round(float(df['MonthlyCharges'].sum()), 2)
    churned_monthly_charges = round(float(df.loc[churned_series, 'MonthlyCharges'].sum()), 2)
    avg_tenure = round(float(df['tenure'].mean()), 1)

    return {
        "total_customers": total_customers,
        "churned_customers": churned_customers,
        "retained_customers": retained_customers,
        "churn_rate": churn_rate,
        "churn_percentage": round(churn_rate * 100, 2),
        "avg_monthly_charges": avg_monthly_charges,
        "total_monthly_revenue": total_monthly_revenue,
        "churned_monthly_charges": churned_monthly_charges,
        "avg_tenure_months": avg_tenure
    }


def compute_dimension_breakdown(df: pd.DataFrame, dimension: str) -> List[Dict[str, Any]]:
    """
    Computes churn rate and counts broken down by any categorical dimension.
    """
    if dimension not in df.columns:
        raise ValueError(f"Dimension '{dimension}' not found in dataframe.")

    churned_col = (df['Churn'].str.strip().str.lower() == 'yes').astype(int)
    temp_df = df[[dimension, 'MonthlyCharges']].copy()
    temp_df['is_churned'] = churned_col

    breakdown = (
        temp_df.groupby(dimension, observed=False)
        .agg(
            total_customers=('is_churned', 'count'),
            churned_customers=('is_churned', 'sum'),
            avg_monthly_charges=('MonthlyCharges', 'mean')
        )
        .reset_index()
    )
    breakdown['retained_customers'] = breakdown['total_customers'] - breakdown['churned_customers']
    breakdown['churn_rate'] = (breakdown['churned_customers'] / breakdown['total_customers']).round(4)
    breakdown['churn_pct'] = (breakdown['churn_rate'] * 100).round(2)
    breakdown['avg_monthly_charges'] = breakdown['avg_monthly_charges'].round(2)

    return breakdown.rename(columns={dimension: "category"}).to_dict(orient="records")


def compute_all_breakdowns(df: pd.DataFrame) -> Dict[str, List[Dict[str, Any]]]:
    """
    Computes breakdowns for all key analytical dimensions.
    """
    dimensions = [
        "Contract",
        "InternetService",
        "PaymentMethod",
        "tenure_group" if "tenure_group" in df.columns else None,
        "PaperlessBilling",
        "SeniorCitizen",
        "Partner",
        "Dependents",
        "TechSupport",
        "OnlineSecurity"
    ]
    results = {}
    for dim in dimensions:
        if dim and dim in df.columns:
            results[dim] = compute_dimension_breakdown(df, dim)
    return results
