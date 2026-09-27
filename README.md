# Customer Churn Intelligence Platform

An end-to-end Machine Learning, Full-Stack Analytics, and Business Intelligence platform built on the IBM Telco Customer Churn dataset.

---

## 📌 Architecture & Features

- **Data Engineering & EDA:** Comprehensive data cleaning, handling whitespace/edge cases in `TotalCharges`, statistical analysis, and interactive visualizations.
- **Machine Learning Pipeline:** Stratified model comparison (Logistic Regression, Decision Tree, Random Forest, XGBoost) with metrics including Accuracy, Precision, Recall, F1, ROC-AUC, and global feature importance.
- **Production FastAPI Backend:** REST API with Pydantic validation, pipeline serialization via Joblib, health status, prediction engine, and aggregated analytics endpoints.
- **Full-Stack Web Interface:** Modern, responsive UI with interactive dashboards, customer lookup, real-time churn prediction simulation, and model performance benchmarks.
- **Business Intelligence Dashboards:** Tableau & Power BI dashboards built from verified processed data.

---

## 📂 Project Structure

```text
customer-churn-intelligence/
├── dataset/
│   ├── raw/                 # Original unmodified dataset
│   └── processed/           # Cleaned and engineered datasets for modeling & BI
├── notebooks/               # Jupyter/Colab notebooks for EDA and ML experimentation
├── src/
│   ├── data/                # Data loading, validation, and cleaning scripts
│   ├── features/            # Feature preprocessing pipelines and transformers
│   ├── models/              # Model training, evaluation, and inference utilities
│   └── analytics/           # Business metrics & segmentation engines
├── artifacts/               # Serialized models and metadata
├── backend/                 # FastAPI REST API
│   ├── services/            # Business & prediction services
│   └── tests/               # API and unit tests
├── frontend/                # React / TypeScript web application
├── dashboards/              # Tableau & Power BI workbooks and assets
├── reports/                 # Analysis summaries and findings
└── requirements.txt         # Project Python dependencies
```

---

## 🚀 Setup & Execution

### 1. Environment Setup
```bash
pip install -r requirements.txt
```

### 2. Dataset Verification
```bash
python src/data/verify_dataset.py
```

---

## 📊 Dataset Information
- **Source:** IBM Telco Customer Churn (Kaggle)
- **Observations:** 7,043 customers
- **Features:** 21 attributes (Demographics, Services, Account details, Charges)
- **Target:** `Churn` (`Yes` = 26.54%, `No` = 73.46%)
