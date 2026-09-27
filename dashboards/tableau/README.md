# Tableau Churn Intelligence Workbook Guide

This directory contains specifications, calculated fields, and sheet layout templates for the Customer Churn Tableau Workbook.

---

## 📊 Data Source Connection
Connect Tableau Desktop or Tableau Public to the verified cleaned dataset:
- **Primary Data Source:** `dataset/processed/customers_clean.csv` (7,043 rows)
- **Aggregated Metrics Source:** `dataset/processed/dashboard_metrics.csv` (180 rows)

---

## 📐 Calculated Fields Dictionary (Tableau Formulas)

| Calculated Field Name | Tableau Formula | Description |
| :--- | :--- | :--- |
| `[Total Customers]` | `COUNTD([customerID])` | Total unique customer count |
| `[Churned Customers]` | `SUM(IIF([Churn] = "Yes", 1, 0))` | Count of churned customers |
| `[Retained Customers]` | `SUM(IIF([Churn] = "No", 1, 0))` | Count of retained customers |
| `[Churn Rate]` | `[Churned Customers] / [Total Customers]` | Churn rate percentage (Format as %) |
| `[Avg Monthly Charges]` | `AVG([MonthlyCharges])` | Mean monthly billing (Format as Currency $) |
| `[Churned Monthly MRR]` | `SUM(IIF([Churn] = "Yes", [MonthlyCharges], 0))` | Total monthly charges associated with churned accounts |

---

## 🖥️ Dashboard Architecture

### Dashboard 1: Customer Executive Overview
- **Header KPI Cards:** Total Customers (7,043), Retained Base (5,174), Churned Accounts (1,869), Churn Rate (26.54%), Total MRR ($456.1K), Churned MRR ($139.1K).
- **Visual 1:** Donut Chart displaying overall customer churn distribution (73.5% Retained vs. 26.5% Churned).
- **Visual 2:** Monthly Charges vs. Tenure Scatter Plot with Churn status color-encoding.

### Dashboard 2: Churn Drivers & Segment Risk
- **Visual 1 (Contract Hazard):** Horizontal bar chart comparing Month-to-month (42.7%), One year (11.3%), Two year (2.8%).
- **Visual 2 (Tenure Cohort Curve):** Line/Bar chart across 0-12 Mos, 13-24 Mos, 25-48 Mos, 49-60 Mos, 61-72 Mos.
- **Visual 3 (Internet & Value-Added Services):** Matrix comparing Fiber optic vs. DSL vs. No Internet with Tech Support and Security filters.
- **Visual 4 (Payment Method):** Breakdown highlighting Electronic check (45.3%) vs Auto-debit methods (15.5%).

### Dashboard 3: Revenue & Financial Exposure Analysis
- **Visual 1:** Distribution histogram of Monthly Charges segmented by Churn status.
- **Visual 2:** Tree Map of associated churn revenue exposure across Contract and Internet Service segments.
- **Interactive Slicers / Global Filters:** Contract, Internet Service, Payment Method, Senior Citizen, Partner/Dependents.

---

## 🎨 Design Theme
- **Color Palette (Dark Mode):** Background `#0f172a`, Retained `#38bdf8` / `#34d399`, Churned `#f43f5e`, Text `#f8fafc`.
