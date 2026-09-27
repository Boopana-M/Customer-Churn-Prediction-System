# Power BI Churn Intelligence Dashboard Guide

This directory contains DAX measure formulas, data modeling instructions, and visual layout guides for creating the Customer Churn Power BI Report (`.pbix`).

---

## 📊 Data Source Setup
1. Open **Power BI Desktop**.
2. Select **Get Data -> Text/CSV** and import:
   - `dataset/processed/customers_clean.csv`
3. In Power Query, verify column data types:
   - `MonthlyCharges`, `TotalCharges` -> `Decimal Number`
   - `tenure`, `SeniorCitizen`, `Churn_Binary` -> `Whole Number`
   - All categorical columns -> `Text`
4. Click **Close & Apply**.

---

## 📐 Enterprise DAX Measures

Create a dedicated `_Measures` table in Power BI and implement the following DAX expressions:

```dax
// 1. Total Customers Count
Total Customers = DISTINCTCOUNT(customers_clean[customerID])

// 2. Churned Customers Count
Churned Customers = 
CALCULATE(
    COUNTROWS(customers_clean),
    customers_clean[Churn] = "Yes"
)

// 3. Retained Customers Count
Retained Customers = 
CALCULATE(
    COUNTROWS(customers_clean),
    customers_clean[Churn] = "No"
)

// 4. Churn Rate Percentage
Churn Rate = 
DIVIDE([Churned Customers], [Total Customers], 0)

// 5. Total Monthly Revenue
Total Monthly Revenue = SUM(customers_clean[MonthlyCharges])

// 6. Average Monthly Charges
Average Monthly Charges = AVERAGE(customers_clean[MonthlyCharges])

// 7. Churned Monthly MRR Exposure
Churned Monthly Revenue = 
CALCULATE(
    SUM(customers_clean[MonthlyCharges]),
    customers_clean[Churn] = "Yes"
)

// 8. Average Tenure
Average Customer Tenure = AVERAGE(customers_clean[tenure])
```

---

## 🖥️ Report Pages Layout

### Page 1: Executive Summary
- **KPI Cards:** `[Total Customers]`, `[Churn Rate]`, `[Total Monthly Revenue]`, `[Churned Monthly Revenue]`, `[Average Customer Tenure]`.
- **Donut Visual:** Legend: `Churn` (`Yes`/`No`), Values: `[Total Customers]`.
- **Bar Chart:** Churn Rate by `Contract`.
- **Bar Chart:** Churn Rate by `InternetService`.
- **Slicers:** `tenure_group`, `PaymentMethod`, `PaperlessBilling`.

### Page 2: Churn Segmentation & Behavior
- **Visual 1:** 100% Stacked Bar Chart of Churn Status by `tenure_group`.
- **Visual 2:** Clustered Column Chart comparing Churn Rate across `PaymentMethod` categories.
- **Visual 3:** Matrix grid of `TechSupport` and `OnlineSecurity` vs `Churn Rate`.
- **Visual 4:** Scatter Plot of `MonthlyCharges` vs `TotalCharges` colored by `Churn`.

### Page 3: Financial Impact & Customer Drillthrough
- **Table / Matrix Grid:** Drillthrough table listing `customerID`, `Contract`, `tenure`, `MonthlyCharges`, `TotalCharges`, and `Churn`.
- **Decomposition Tree:** AI Decomposition Tree analyzing root drivers of `[Churned Customers]`.

---

## 🎨 Theme & Accessibility
- **Dark Theme:** Canvas background `#0f172a`, card fill `#1e293b`, font family `Segoe UI` / `Plus Jakarta Sans`.
