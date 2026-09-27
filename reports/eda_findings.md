# Exploratory Data Analysis & Statistical Findings

**Dataset:** IBM Telco Customer Churn  
**Total Records:** 7,043 customers  
**Cleaned Features:** 21 attributes + engineered cohorts (`tenure_group`, `Churn_Binary`)  

---

## 1. Executive Summary & Core KPIs

| KPI Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Customers** | **7,043** | Unique customer accounts analyzed |
| **Retained Customers** | **5,174** (73.46%) | Active/retained subscriber base |
| **Churned Customers** | **1,869** (26.54%) | Subscribers who discontinued service |
| **Average Monthly Charges** | **$64.76** | Across entire customer base |
| **Total Monthly Revenue** | **$456,116.6** | Sum of all active monthly billings |
| **Churned Monthly Charges** | **$139,130.85** | Monthly billing associated with churned accounts |
| **Average Customer Tenure** | **32.4 months** | Mean tenure across all customers |

---

## 2. Key Statistical Insights & Dimensions

### A. Contract Structure (Highest Risk Factor)
- **Month-to-month:** Churn rate of **42.71%** (2,220 of 3,875 customers).
- **One year:** Churn rate drops to **11.27%** (166 of 1,473 customers).
- **Two year:** Churn rate drops to **2.83%** (48 of 1,695 customers).
> *Observation:* Customers on month-to-month contracts have approximately **15x higher churn rate** than those committed to two-year contracts.

### B. Customer Tenure Cohort (Early Life-Cycle Hazard)
- **0–12 Months:** Churn rate of **47.44%** (1,037 churned out of 2,186).
- **13–24 Months:** Churn rate of **28.70%** (294 churned).
- **25–48 Months:** Churn rate of **19.38%** (309 churned).
- **49–60 Months:** Churn rate of **13.79%** (115 churned).
- **61–72 Months:** Churn rate of **6.61%** (114 churned out of 1,725).
> *Observation:* Over **55.5% of all churn events** occur within the first year of subscription.

### C. Internet Service Type
- **Fiber Optic:** Churn rate of **41.89%** (1,297 churned out of 3,096).
- **DSL:** Churn rate of **18.96%** (459 churned out of 2,421).
- **No Internet:** Churn rate of **7.40%** (113 churned out of 1,526).
> *Observation:* Fiber optic customers exhibit significantly higher monthly charges (average ~$91/mo) and markedly elevated churn rates, indicating pricing or service experience sensitivity.

### D. Payment Method
- **Electronic Check:** Churn rate of **45.29%** (1,071 churned out of 2,365).
- **Mailed Check:** Churn rate of **19.11%** (308 churned out of 1,612).
- **Bank Transfer (auto):** Churn rate of **16.71%** (258 churned out of 1,544).
- **Credit Card (auto):** Churn rate of **15.24%** (232 churned out of 1,522).
> *Observation:* Customers using automated billing methods (Bank transfer or Credit card) churn at less than half the rate of electronic check users.

### E. Tech Support & Value-Added Security
- Customers **without Tech Support** churn at **41.64%**, compared to **15.17%** for customers **with Tech Support**.
- Customers **without Online Security** churn at **41.77%**, compared to **14.61%** for customers **with Online Security**.

---

## 3. Visualizations Generated

1. `01_churn_distribution.png`: Overall customer retention vs churn donut chart.
2. `02_churn_by_contract.png`: Bar chart contrasting Month-to-month, 1-year, and 2-year contracts.
3. `03_churn_by_tenure_group.png`: Tenure cohort churn curve highlighting early-tenure vulnerability.
4. `04_churn_by_internet_service.png`: Internet service breakdown comparing Fiber optic, DSL, and None.
5. `05_churn_by_payment_method.png`: Payment method analysis emphasizing electronic check churn.
6. `06_monthly_charges_distribution.png`: Density histogram of Monthly Charges by churn status.
7. `07_tenure_distribution.png`: Density histogram of Tenure by churn status.
8. `08_correlation_heatmap.png`: Correlation matrix across numerical variables and churn.

---

## 4. Analytical Notes & Methodological Guardrails
- **No Causality Implied:** These findings demonstrate empirical associations within historical IBM Telco data and should not be interpreted as proven causal mechanisms without controlled A/B testing.
- **Data Integrity:** All 11 records with zero tenure had their TotalCharges converted to 0.0 with zero dropped rows.
