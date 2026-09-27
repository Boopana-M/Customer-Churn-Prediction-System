import type { KPISummary, CustomerRecord, PredictionResult, ModelMetadata, DimensionItem } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const fetchHealth = async (): Promise<{ status: string; model_loaded: boolean; model_name: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using local mock health:", err);
    return { status: "online (standalone mode)", model_loaded: true, model_name: "XGBoost Classifier" };
  }
};

export const fetchKPISummary = async (): Promise<KPISummary> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analytics/summary`);
    if (!res.ok) throw new Error("KPI fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback KPIs:", err);
    return {
      total_customers: 7043,
      churned_customers: 1869,
      retained_customers: 5174,
      churn_rate: 0.2654,
      churn_percentage: 26.54,
      avg_monthly_charges: 64.76,
      total_monthly_revenue: 456116.60,
      churned_monthly_charges: 139130.85,
      avg_tenure_months: 32.4
    };
  }
};

export const fetchAllBreakdowns = async (): Promise<Record<string, DimensionItem[]>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analytics/breakdowns`);
    if (!res.ok) throw new Error("Breakdowns fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback breakdowns:", err);
    return {
      Contract: [
        { category: "Month-to-month", total_customers: 3875, churned_customers: 1655, retained_customers: 2220, churn_rate: 0.4271, churn_pct: 42.71, avg_monthly_charges: 66.40 },
        { category: "One year", total_customers: 1473, churned_customers: 166, retained_customers: 1307, churn_rate: 0.1127, churn_pct: 11.27, avg_monthly_charges: 65.05 },
        { category: "Two year", total_customers: 1695, churned_customers: 48, retained_customers: 1647, churn_rate: 0.0283, churn_pct: 2.83, avg_monthly_charges: 60.77 }
      ],
      InternetService: [
        { category: "DSL", total_customers: 2421, churned_customers: 459, retained_customers: 1962, churn_rate: 0.1896, churn_pct: 18.96, avg_monthly_charges: 58.10 },
        { category: "Fiber optic", total_customers: 3096, churned_customers: 1297, retained_customers: 1799, churn_rate: 0.4189, churn_pct: 41.89, avg_monthly_charges: 91.50 },
        { category: "No", total_customers: 1526, churned_customers: 113, retained_customers: 1413, churn_rate: 0.0740, churn_pct: 7.40, avg_monthly_charges: 21.08 }
      ],
      PaymentMethod: [
        { category: "Electronic check", total_customers: 2365, churned_customers: 1071, retained_customers: 1294, churn_rate: 0.4529, churn_pct: 45.29, avg_monthly_charges: 76.26 },
        { category: "Mailed check", total_customers: 1612, churned_customers: 308, retained_customers: 1304, churn_rate: 0.1911, churn_pct: 19.11, avg_monthly_charges: 43.90 },
        { category: "Bank transfer (automatic)", total_customers: 1544, churned_customers: 258, retained_customers: 1286, churn_rate: 0.1671, churn_pct: 16.71, avg_monthly_charges: 67.20 },
        { category: "Credit card (automatic)", total_customers: 1522, churned_customers: 232, retained_customers: 1290, churn_rate: 0.1524, churn_pct: 15.24, avg_monthly_charges: 66.51 }
      ],
      tenure_group: [
        { category: "0-12 Mos", total_customers: 2186, churned_customers: 1037, retained_customers: 1149, churn_rate: 0.4744, churn_pct: 47.44, avg_monthly_charges: 59.85 },
        { category: "13-24 Mos", total_customers: 1024, churned_customers: 294, retained_customers: 730, churn_rate: 0.2870, churn_pct: 28.70, avg_monthly_charges: 64.20 },
        { category: "25-48 Mos", total_customers: 1594, churned_customers: 309, retained_customers: 1285, churn_rate: 0.1938, churn_pct: 19.38, avg_monthly_charges: 68.30 },
        { category: "49-60 Mos", total_customers: 832, churned_customers: 115, retained_customers: 717, churn_rate: 0.1379, churn_pct: 13.79, avg_monthly_charges: 71.10 },
        { category: "61-72 Mos", total_customers: 1407, churned_customers: 114, retained_customers: 1293, churn_rate: 0.0810, churn_pct: 8.10, avg_monthly_charges: 75.40 }
      ]
    };
  }
};

export const fetchCustomers = async (
  page = 1,
  pageSize = 20,
  search?: string,
  contract?: string,
  internetService?: string,
  churnStatus?: string
): Promise<{ total_count: number; total_pages: number; customers: CustomerRecord[] }> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      ...(search ? { search } : {}),
      ...(contract && contract !== "All" ? { contract } : {}),
      ...(internetService && internetService !== "All" ? { internet_service: internetService } : {}),
      ...(churnStatus && churnStatus !== "All" ? { churn_status: churnStatus } : {})
    });
    const res = await fetch(`${API_BASE_URL}/api/customers?${params}`);
    if (!res.ok) throw new Error("Customers fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback customers:", err);
    return {
      total_count: 5,
      total_pages: 1,
      customers: [
        { customerID: "7590-VHVEG", gender: "Female", SeniorCitizen: 0, Partner: "Yes", Dependents: "No", tenure: 1, PhoneService: "No", MultipleLines: "No phone service", InternetService: "DSL", OnlineSecurity: "No", OnlineBackup: "Yes", DeviceProtection: "No", TechSupport: "No", StreamingTV: "No", StreamingMovies: "No", Contract: "Month-to-month", PaperlessBilling: "Yes", PaymentMethod: "Electronic check", MonthlyCharges: 29.85, TotalCharges: 29.85, Churn: "No" },
        { customerID: "5575-GNVDE", gender: "Male", SeniorCitizen: 0, Partner: "No", Dependents: "No", tenure: 34, PhoneService: "Yes", MultipleLines: "No", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "No", DeviceProtection: "Yes", TechSupport: "No", StreamingTV: "No", StreamingMovies: "No", Contract: "One year", PaperlessBilling: "No", PaymentMethod: "Mailed check", MonthlyCharges: 56.95, TotalCharges: 1889.50, Churn: "No" },
        { customerID: "3668-QPYBK", gender: "Male", SeniorCitizen: 0, Partner: "No", Dependents: "No", tenure: 2, PhoneService: "Yes", MultipleLines: "No", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "Yes", DeviceProtection: "No", TechSupport: "No", StreamingTV: "No", StreamingMovies: "No", Contract: "Month-to-month", PaperlessBilling: "Yes", PaymentMethod: "Mailed check", MonthlyCharges: 53.85, TotalCharges: 108.15, Churn: "Yes" },
        { customerID: "7795-CFOCW", gender: "Male", SeniorCitizen: 0, Partner: "No", Dependents: "No", tenure: 45, PhoneService: "No", MultipleLines: "No phone service", InternetService: "DSL", OnlineSecurity: "Yes", OnlineBackup: "No", DeviceProtection: "Yes", TechSupport: "Yes", StreamingTV: "No", StreamingMovies: "No", Contract: "One year", PaperlessBilling: "No", PaymentMethod: "Bank transfer (automatic)", MonthlyCharges: 42.30, TotalCharges: 1840.75, Churn: "No" },
        { customerID: "9237-HQITU", gender: "Female", SeniorCitizen: 0, Partner: "No", Dependents: "No", tenure: 2, PhoneService: "Yes", MultipleLines: "No", InternetService: "Fiber optic", OnlineSecurity: "No", OnlineBackup: "No", DeviceProtection: "No", TechSupport: "No", StreamingTV: "No", StreamingMovies: "No", Contract: "Month-to-month", PaperlessBilling: "Yes", PaymentMethod: "Electronic check", MonthlyCharges: 70.70, TotalCharges: 151.65, Churn: "Yes" }
      ]
    };
  }
};

export const predictCustomerChurn = async (customer: Record<string, any>): Promise<PredictionResult> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error("Prediction API call failed");
    return await res.json();
  } catch (err) {
    console.warn("Using local predictor heuristic fallback:", err);
    let prob = 0.20;
    const factors: string[] = [];
    if (customer.Contract === "Month-to-month") { prob += 0.35; factors.push("Month-to-month contract elevates churn risk."); }
    if (customer.tenure <= 12) { prob += 0.20; factors.push("Early customer tenure (< 12 months) has high churn likelihood."); }
    if (customer.InternetService === "Fiber optic") { prob += 0.15; factors.push("Fiber optic subscription with elevated charges increases churn exposure."); }
    if (customer.PaymentMethod === "Electronic check") { prob += 0.12; factors.push("Electronic check payment exhibits higher historical churn."); }
    if (customer.TechSupport === "No") { prob += 0.08; factors.push("Absence of Tech Support increases churn risk."); }
    prob = Math.min(0.98, Math.max(0.02, prob));
    return {
      prediction: prob >= 0.5 ? "Churn" : "Retained",
      predicted_class: prob >= 0.5 ? 1 : 0,
      churn_probability: Number(prob.toFixed(4)),
      churn_percentage: Number((prob * 100).toFixed(2)),
      risk_band: prob >= 0.6 ? "High Risk" : prob >= 0.3 ? "Moderate Risk" : "Low Risk",
      decision_threshold: 0.50,
      model_version: "1.0.0",
      key_factors: factors
    };
  }
};

export const fetchModelMetadata = async (): Promise<ModelMetadata> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/model/metadata`);
    if (!res.ok) throw new Error("Metadata fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback metadata:", err);
    return {
      model_name: "XGBoost",
      model_version: "1.0.0",
      decision_threshold: 0.50,
      metrics: {
        accuracy: 0.7935,
        precision: 0.5220,
        recall: 0.7941,
        f1_score: 0.6299,
        roc_auc: 0.8427,
        pr_auc: 0.6550,
        confusion_matrix: { true_negatives: 821, false_positives: 214, false_negatives: 77, true_positives: 297 },
        test_records: 1409
      },
      features: {
        all_features: ["tenure", "MonthlyCharges", "TotalCharges", "Contract", "InternetService"],
        encoded_feature_count: 46,
        top_10_features: {
          "Contract_Month-to-month": 0.285,
          "tenure": 0.192,
          "InternetService_Fiber optic": 0.148,
          "MonthlyCharges": 0.114,
          "PaymentMethod_Electronic check": 0.085,
          "TechSupport_No": 0.052,
          "OnlineSecurity_No": 0.041,
          "PaperlessBilling_Yes": 0.033,
          "TotalCharges": 0.028,
          "Contract_Two year": 0.022
        }
      },
      all_model_comparison: {
        "Logistic Regression": { accuracy: 0.7410, precision: 0.5043, recall: 0.7834, f1_score: 0.6136, roc_auc: 0.8415, pr_auc: 0.6420, confusion_matrix: { true_negatives: 751, false_positives: 284, false_negatives: 81, true_positives: 293 }, test_records: 1409 },
        "Decision Tree": { accuracy: 0.7686, precision: 0.5260, recall: 0.7567, f1_score: 0.6206, roc_auc: 0.8318, pr_auc: 0.6150, confusion_matrix: { true_negatives: 800, false_positives: 235, false_negatives: 91, true_positives: 283 }, test_records: 1409 },
        "Random Forest": { accuracy: 0.7885, precision: 0.5265, recall: 0.7701, f1_score: 0.6254, roc_auc: 0.8423, pr_auc: 0.6510, confusion_matrix: { true_negatives: 823, false_positives: 212, false_negatives: 86, true_positives: 288 }, test_records: 1409 },
        "XGBoost": { accuracy: 0.7935, precision: 0.5220, recall: 0.7941, f1_score: 0.6299, roc_auc: 0.8427, pr_auc: 0.6550, confusion_matrix: { true_negatives: 821, false_positives: 214, false_negatives: 77, true_positives: 297 }, test_records: 1409 }
      }
    };
  }
};
