"""
Data preparation and cleaning pipeline for IBM Telco Customer Churn dataset.
Generates cleaned datasets for machine learning and BI dashboards.
"""
from pathlib import Path
from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd


def load_raw_data(filepath: str = "dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv") -> pd.DataFrame:
    """Loads the raw customer churn CSV dataset."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Raw dataset file not found at: {path.resolve()}")
    return pd.read_csv(path)


def clean_churn_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw Telco data:
    1. Strips column and string whitespace.
    2. Converts TotalCharges to numeric, setting whitespace rows (tenure=0) to 0.0.
    3. Adds derived tenure cohort / tenure band column for analytical convenience.
    4. Validates value constraints (no negative charges, tenure between 0 and 72).
    """
    cleaned_df = df.copy()

    # Strip column names
    cleaned_df.columns = cleaned_df.columns.str.strip()

    # Convert TotalCharges to numeric; coerce blanks to NaN then fill with 0.0 for tenure=0
    cleaned_df['TotalCharges'] = pd.to_numeric(cleaned_df['TotalCharges'].astype(str).str.strip(), errors='coerce')
    cleaned_df['TotalCharges'] = cleaned_df['TotalCharges'].fillna(0.0)

    # Validate value ranges
    if (cleaned_df['tenure'] < 0).any():
        raise ValueError("Found invalid negative tenure values.")
    if (cleaned_df['MonthlyCharges'] < 0).any():
        raise ValueError("Found invalid negative MonthlyCharges.")
    if (cleaned_df['TotalCharges'] < 0).any():
        raise ValueError("Found invalid negative TotalCharges.")

    # Categorize tenure into analytical cohorts (useful for segmentation, EDA, BI)
    bins = [-1, 12, 24, 48, 60, 72]
    labels = ['0-12 Mos', '13-24 Mos', '25-48 Mos', '49-60 Mos', '61-72 Mos']
    cleaned_df['tenure_group'] = pd.cut(cleaned_df['tenure'], bins=bins, labels=labels)

    # Ensure binary integer target column for ML analysis while keeping original string
    cleaned_df['Churn_Binary'] = cleaned_df['Churn'].map({'Yes': 1, 'No': 0}).astype(int)

    return cleaned_df


def generate_dashboard_metrics(cleaned_df: pd.DataFrame) -> pd.DataFrame:
    """
    Creates an aggregated metrics table grouped by key dimensions:
    Contract, InternetService, PaymentMethod, and tenure_group.
    """
    metrics = (
        cleaned_df.groupby(['Contract', 'InternetService', 'PaymentMethod', 'tenure_group'], observed=False)
        .agg(
            total_customers=('customerID', 'count'),
            churned_customers=('Churn_Binary', 'sum'),
            retained_customers=('Churn_Binary', lambda x: (x == 0).sum()),
            avg_monthly_charges=('MonthlyCharges', 'mean'),
            total_monthly_charges=('MonthlyCharges', 'sum'),
            churned_monthly_charges=('MonthlyCharges', lambda x: x[cleaned_df.loc[x.index, 'Churn_Binary'] == 1].sum()),
            avg_total_charges=('TotalCharges', 'mean'),
            avg_tenure=('tenure', 'mean')
        )
        .reset_index()
    )
    metrics['churn_rate'] = (metrics['churned_customers'] / metrics['total_customers']).round(4)
    metrics['avg_monthly_charges'] = metrics['avg_monthly_charges'].round(2)
    metrics['avg_total_charges'] = metrics['avg_total_charges'].round(2)
    metrics['avg_tenure'] = metrics['avg_tenure'].round(1)
    return metrics


def process_and_save_data(
    raw_path: str = "dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv",
    output_dir: str = "dataset/processed"
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Runs data cleaning and exports customers_clean.csv and dashboard_metrics.csv."""
    raw_df = load_raw_data(raw_path)
    cleaned_df = clean_churn_data(raw_df)
    dashboard_df = generate_dashboard_metrics(cleaned_df)

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    clean_file = out_path / "customers_clean.csv"
    metrics_file = out_path / "dashboard_metrics.csv"

    cleaned_df.to_csv(clean_file, index=False)
    dashboard_df.to_csv(metrics_file, index=False)

    print(f"Cleaned dataset saved: {clean_file.resolve()} ({len(cleaned_df)} rows)")
    print(f"Dashboard metrics saved: {metrics_file.resolve()} ({len(dashboard_df)} aggregated rows)")

    return cleaned_df, dashboard_df


if __name__ == "__main__":
    process_and_save_data()
