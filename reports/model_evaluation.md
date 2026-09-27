# Machine Learning Model Evaluation & Benchmarks

**Dataset:** IBM Telco Customer Churn (7,043 records)  
**Train / Test Split:** 80% Train (5,634 samples) / 20% Test (1,409 samples, Stratified)  
**Selected Champion Model:** **XGBoost** (v1.0.0)  

---

## 1. Candidate Model Comparison Benchmark

| Model Candidate | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Confusion Matrix (Test Set) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | 0.7381 | 0.5043 | 0.7834 | 0.6136 | **0.8415** | 0.6325 | TP=293, FP=288, FN=81, TN=747 |
| **Decision Tree** | 0.7544 | 0.5260 | 0.7567 | 0.6206 | **0.8318** | 0.6185 | TP=283, FP=255, FN=91, TN=780 |
| **Random Forest** | 0.7551 | 0.5265 | 0.7701 | 0.6254 | **0.8423** | 0.6477 | TP=288, FP=259, FN=86, TN=776 |
| **XGBoost** | 0.7523 | 0.5220 | 0.7941 | 0.6299 | **0.8427** | 0.6577 | TP=297, FP=272, FN=77, TN=763 |

---

## 2. Champion Model In-Depth Analysis: `XGBoost`

- **ROC-AUC Score:** **0.8427** — Demonstrates strong discriminative capability across varied classification thresholds.
- **Recall on Churn Class:** **0.7941** — Successfully catches the majority of customers at risk of churn.
- **Precision:** **0.5220**
- **F1-Score:** **0.6299**

### Confusion Matrix Breakdown (Test Set: 1,409 instances)
- **True Positives (Correctly identified churn):** 297
- **False Positives (Retained customers flagged as churn):** 272
- **False Negatives (Churned customers missed):** 77
- **True Negatives (Correctly identified retained):** 763

---

## 3. Global Feature Importance (Top 10 Influential Features)

| Feature / One-Hot Encoding | Relative Importance |
| :--- | :--- |
| `Contract_Month-to-month` | 0.5134 |
| `InternetService_Fiber optic` | 0.0765 |
| `OnlineSecurity_No` | 0.0469 |
| `TechSupport_No` | 0.0420 |
| `InternetService_DSL` | 0.0355 |
| `StreamingMovies_Yes` | 0.0282 |
| `PaymentMethod_Electronic check` | 0.0223 |
| `Contract_One year` | 0.0220 |
| `Contract_Two year` | 0.0219 |
| `tenure` | 0.0200 |

> *Note on Interpretability:* Feature importance reflects the mathematical weight allocated by the tree ensemble. It indicates statistical predictive value within the dataset and does not establish independent real-world causality.

---

## 4. Risk Stratification Policy

For business actionability, predicted probabilities are mapped to three operational risk tiers:
- **Low Risk (0.00 – 0.30):** Routine standard engagement.
- **Moderate Risk (0.30 – 0.60):** Proactive engagement, loyalty incentives, service satisfaction check.
- **High Risk (0.60 – 1.00):** Priority retention outreach, customized renewal incentives.
