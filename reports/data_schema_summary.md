# Dataset Schema & Verification Summary

**Dataset:** IBM Telco Customer Churn  
**File:** `dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv`  
**Dimensions:** 7,043 rows, 21 columns  
**Target Variable:** `Churn` (`Yes` = 1,869 / 26.54%, `No` = 5,174 / 73.46%)  

---

## 1. Column Inventory & Data Types

| Column Name | Raw Data Type | Cardinality | Description / Values |
| :--- | :--- | :--- | :--- |
| `customerID` | `object` (string) | 7,043 | Unique customer identifier (e.g. `7590-VHVEG`) |
| `gender` | `object` (string) | 2 | `Male`, `Female` |
| `SeniorCitizen` | `int64` | 2 | `0` (No), `1` (Yes) |
| `Partner` | `object` (string) | 2 | `Yes`, `No` |
| `Dependents` | `object` (string) | 2 | `Yes`, `No` |
| `tenure` | `int64` | 73 | Number of months customer has stayed with company (0-72) |
| `PhoneService` | `object` (string) | 2 | `Yes`, `No` |
| `MultipleLines` | `object` (string) | 3 | `No`, `Yes`, `No phone service` |
| `InternetService` | `object` (string) | 3 | `DSL`, `Fiber optic`, `No` |
| `OnlineSecurity` | `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `OnlineBackup` | `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `DeviceProtection`| `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `TechSupport` | `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `StreamingTV` | `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `StreamingMovies` | `object` (string) | 3 | `No`, `Yes`, `No internet service` |
| `Contract` | `object` (string) | 3 | `Month-to-month`, `One year`, `Two year` |
| `PaperlessBilling`| `object` (string) | 2 | `Yes`, `No` |
| `PaymentMethod` | `object` (string) | 4 | `Electronic check`, `Mailed check`, `Bank transfer (automatic)`, `Credit card (automatic)` |
| `MonthlyCharges` | `float64` | 1,585 | Monthly amount charged to customer |
| `TotalCharges` | `object` (string) | 6,531 | Total amount charged to customer (contains 11 whitespace strings) |
| `Churn` | `object` (string) | 2 | Target column: `Yes` (Churned), `No` (Retained) |

---

## 2. Key Data Quality Findings

1. **Uniqueness:** 7,043 unique `customerID` records across 7,043 rows — zero duplicate rows.
2. **Whitespace / Hidden Nulls in `TotalCharges`:** 
   - 11 records have `" "` (empty space) in `TotalCharges`.
   - Inspection shows all 11 records correspond strictly to customers with `tenure == 0` (brand new customers).
   - In data preparation, these will be converted to numeric: setting `TotalCharges = 0.0` or `TotalCharges = MonthlyCharges` (since tenure is 0) with zero data loss.
3. **Target Imbalance:**
   - 73.46% Retained (`No`) vs. 26.54% Churned (`Yes`).
   - Stratified train/test splitting and evaluation metrics beyond accuracy (ROC-AUC, Precision, Recall, F1, PR-AUC) are mandatory.
