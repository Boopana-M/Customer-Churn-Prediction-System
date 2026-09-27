"""
Dataset Verification Script for IBM Telco Customer Churn
Checks schema, shapes, missing values, blank values in TotalCharges, and target distribution.
"""
from pathlib import Path
import pandas as pd
import numpy as np


def verify_raw_dataset(data_path: str = "dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv") -> dict:
    csv_file = Path(data_path)
    if not csv_file.exists():
        raise FileNotFoundError(f"Dataset file not found at: {csv_file.resolve()}")

    df = pd.read_csv(csv_file)
    print("=" * 60)
    print("DATASET VERIFICATION REPORT")
    print("=" * 60)
    print(f"File Path: {csv_file.resolve()}")
    print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print("-" * 60)

    # Column inspection
    print("\nColumns & Data Types:")
    for col in df.columns:
        print(f"  - {col:25s} : {str(df[col].dtype):10s} (Unique: {df[col].nunique()})")

    # Check customerID uniqueness
    unique_ids = df['customerID'].nunique()
    print(f"\nUnique customerIDs: {unique_ids} / {len(df)} records")

    # Check missing values
    null_counts = df.isnull().sum()
    print(f"\nExplicit Null / NaN count per column:")
    for col, nulls in null_counts.items():
        if nulls > 0:
            print(f"  - {col}: {nulls}")
    if null_counts.sum() == 0:
        print("  None (0 explicit nulls)")

    # Check blank or whitespace strings
    blank_counts = {}
    for col in df.select_dtypes(include=['object']).columns:
        blanks = (df[col].astype(str).str.strip() == "").sum()
        if blanks > 0:
            blank_counts[col] = blanks
    print(f"\nBlank / Whitespace strings detected:")
    for col, count in blank_counts.items():
        print(f"  - {col}: {count} whitespace records")
    if not blank_counts:
        print("  None")

    # TotalCharges inspection
    if 'TotalCharges' in df.columns:
        whitespace_tc = df[df['TotalCharges'].astype(str).str.strip() == ""]
        print(f"\nTotalCharges blank rows inspection:")
        print(f"  - Blank TotalCharges count: {len(whitespace_tc)}")
        if len(whitespace_tc) > 0:
            print("  - Sample records with blank TotalCharges:")
            print(whitespace_tc[['customerID', 'tenure', 'MonthlyCharges', 'TotalCharges', 'Churn']].head())
            print(f"  - Tenure values for blank TotalCharges: {whitespace_tc['tenure'].value_counts().to_dict()}")

    # Target Distribution
    print(f"\nTarget Variable ('Churn') Distribution:")
    churn_counts = df['Churn'].value_counts()
    churn_pct = df['Churn'].value_counts(normalize=True) * 100
    for val in churn_counts.index:
        print(f"  - {val:5s}: {churn_counts[val]:5d} ({churn_pct[val]:.2f}%)")

    metrics = {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "unique_customers": unique_ids,
        "blank_total_charges": blank_counts.get("TotalCharges", 0),
        "churn_counts": churn_counts.to_dict(),
        "churn_percentages": {k: round(v, 2) for k, v in churn_pct.to_dict().items()}
    }
    print("=" * 60)
    print("VERIFICATION COMPLETED SUCCESSFULLY")
    print("=" * 60)
    return metrics


if __name__ == "__main__":
    verify_raw_dataset()
