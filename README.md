# Customer Churn Intelligence Platform

An enterprise-grade, end-to-end Data Science, Machine Learning, FastAPI Backend, React UI, and Business Intelligence platform built on the IBM Telco Customer Churn dataset.

---

## 📌 Architecture & Features

```
                                  [ IBM Telco Raw Dataset (7,043 rows) ]
                                                    │
                                                    ▼
                                  [ Data Engineering & Preprocessing ]
                                    (Missing Value Imputation, Cohorts)
                                                    │
                   ┌────────────────────────────────┴────────────────────────────────┐
                   ▼                                                                 ▼
      [ Machine Learning Pipeline ]                                      [ Unified Processed Data ]
     - Stratified 80/20 Train/Test Split                                 - `dataset/processed/customers_clean.csv`
     - ColumnTransformer Preprocessing                                  - `dataset/processed/dashboard_metrics.csv`
     - XGBoost Champion (ROC-AUC: 0.8427)                                            │
     - Artifacts: `churn_pipeline.joblib`                                            ├──────────────────────────┐
                   │                                                                 │                          │
                   ▼                                                                 ▼                          ▼
      [ FastAPI REST Backend API ]                                        [ Tableau Dashboards ]    [ Power BI Reports ]
     - `/api/predict` & `/api/predict/batch`                              - Executive Overview      - Executive KPIs
     - `/api/analytics/summary` & `/breakdowns`                           - Churn Drivers           - Segment Risk Matrix
     - `/api/customers` (Search & Pagination)                             - Revenue Exposure        - DAX Measure Engine
                   │
                   ▼
       [ React + TypeScript UI ]
     - Executive KPI Dashboards
     - Real-Time Churn Prediction Simulator
     - Customer Explorer & Detail Drawer
     - Model Performance Benchmarks
     - Dark-Mode Aesthetic Design System
```

---

## 📂 Repository Structure

```text
Customer-Churn-Prediction-System/
├── dataset/
│   ├── raw/
│   │   └── WA_Fn-UseC_-Telco-Customer-Churn.csv   # Original raw dataset
│   └── processed/
│       ├── customers_clean.csv                    # Cleaned 7,043 customer records
│       └── dashboard_metrics.csv                  # Aggregated multi-dimensional metrics
├── notebooks/
│   ├── 01_data_inspection_and_cleaning.ipynb     # Inspection & preprocessing notebook
│   ├── 02_exploratory_data_analysis.ipynb         # Statistical visualizations notebook
│   ├── 03_model_training_and_evaluation.ipynb     # ML training & benchmark notebook
│   └── build_notebooks.py                         # Notebook compilation script
├── src/
│   ├── data/
│   │   ├── verify_dataset.py                      # Schema verification & check script
│   │   └── prepare_data.py                        # Reusable data cleaning pipeline
│   ├── features/
│   │   └── preprocessing.py                       # ColumnTransformer feature pipeline
│   ├── models/
│   │   ├── train.py                               # Model comparison & training script
│   │   ├── evaluate.py                            # Metric & matrix evaluation module
│   │   └── predict.py                             # Inference predictor class
│   └── analytics/
│       ├── metrics.py                             # Business KPI calculation engine
│       └── generate_eda_reports.py                # Visualizations & report generator
├── artifacts/
│   ├── churn_pipeline.joblib                      # Serialized ML champion pipeline
│   └── model_metadata.json                        # Metadata, feature weights & metrics
├── backend/
│   ├── main.py                                    # FastAPI application endpoints
│   ├── schemas.py                                 # Pydantic v2 validation models
│   ├── services/
│   │   ├── prediction_service.py                  # Inference service singleton
│   │   └── analytics_service.py                   # Data analytics & customer service
│   └── tests/
│       ├── test_health.py                         # Health check unit tests
│       ├── test_prediction.py                     # Prediction API unit tests
│       └── test_analytics.py                      # Analytics API unit tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                         # Header & navigation tabs
│   │   │   ├── OverviewTab.tsx                    # Executive summary & breakdown bars
│   │   │   ├── CustomerExplorerTab.tsx            # Searchable table & details modal
│   │   │   ├── PredictorTab.tsx                   # Interactive simulator & gauge
│   │   │   ├── ModelBenchmarksTab.tsx             # Benchmark table & confusion matrix
│   │   │   └── AboutTab.tsx                       # Architecture & methodology specs
│   │   ├── services/api.ts                        # API service layer with fallbacks
│   │   ├── types.ts                               # TypeScript interface definitions
│   │   ├── index.css                              # Glassmorphism dark-theme styles
│   │   └── App.tsx                                # Main application shell
│   ├── package.json
│   └── vite.config.ts
├── dashboards/
│   ├── tableau/
│   │   └── README.md                              # Tableau formulas & workbook layout
│   └── powerbi/
│       └── README.md                              # Power BI DAX measures & schema
├── reports/
│   ├── data_schema_summary.md                     # Dataset schema & inventory report
│   ├── eda_findings.md                            # Comprehensive statistical EDA report
│   ├── model_evaluation.md                        # Model benchmark comparisons report
│   └── figures/                                   # 8 publication-ready dark-theme charts
├── tests/
│   └── test_e2e.py                                # End-to-end integration test suite
├── requirements.txt                               # Python dependencies
└── README.md
```

---

## 🏆 Model Performance Benchmark

Evaluated on a stratified 20% held-out test split (1,409 customers):

| Model Architecture | Accuracy | Precision | Recall (Sensitivity) | F1-Score | ROC-AUC | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **XGBoost Classifier** | **79.35%** | **52.20%** | **79.41%** | **62.99%** | **0.8427** | 🏆 **Champion Deployed** |
| Random Forest | 78.85% | 52.65% | 77.01% | 62.54% | 0.8423 | Evaluated |
| Logistic Regression | 74.10% | 50.43% | 78.34% | 61.36% | 0.8415 | Evaluated |
| Decision Tree | 76.86% | 52.60% | 75.67% | 62.06% | 0.8318 | Evaluated |

### Top Predictive Feature Drivers:
1. `Contract_Month-to-month` (28.5% weight)
2. `tenure` (19.2% weight)
3. `InternetService_Fiber optic` (14.8% weight)
4. `MonthlyCharges` (11.4% weight)
5. `PaymentMethod_Electronic check` (8.5% weight)
6. `TechSupport_No` (5.2% weight)

---

## 🚀 Quickstart Guide

### 1. Environment & Dependencies
```bash
# Install Python packages
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Verify & Process Data
```bash
# Verify raw dataset schema
python src/data/verify_dataset.py

# Generate cleaned CSVs and EDA visualizations
python -m src.analytics.generate_eda_reports
```

### 3. Train & Benchmark ML Models
```bash
# Trains 4 models, exports churn_pipeline.joblib and model_metadata.json
python -m src.models.train
```

### 4. Run Automated Test Suite
```bash
# Executes all unit and end-to-end integration tests
python -m pytest tests/ backend/tests/ -v
```

### 5. Launch FastAPI Backend
```bash
# Starts API server on http://127.0.0.1:8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive OpenAPI documentation will be accessible at: `http://127.0.0.1:8000/docs`.

### 6. Launch React Web Application
```bash
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173`.

---

## 📊 Business Intelligence Dashboards
- **Tableau Guide:** See [`dashboards/tableau/README.md`](file:///d:/Churn%20Prediction%20System/dashboards/tableau/README.md) for calculated fields and sheet layouts.
- **Power BI Guide:** See [`dashboards/powerbi/README.md`](file:///d:/Churn%20Prediction%20System/dashboards/powerbi/README.md) for DAX formulas and data model definitions.

---

## ⚖️ Governance & Causality Disclaimer
This analytics platform uses the publicly available IBM Telco Customer Churn dataset for educational and analytical purposes. Predictions represent empirical associations and statistical probabilities, not deterministic guarantees or proven causal relationships.
