export interface KPISummary {
  total_customers: number;
  churned_customers: number;
  retained_customers: number;
  churn_rate: number;
  churn_percentage: number;
  avg_monthly_charges: number;
  total_monthly_revenue: number;
  churned_monthly_charges: number;
  avg_tenure_months: number;
}

export interface DimensionItem {
  category: string;
  total_customers: number;
  churned_customers: number;
  retained_customers: number;
  churn_rate: number;
  churn_pct: number;
  avg_monthly_charges: number;
}

export interface CustomerRecord {
  customerID: string;
  gender: "Male" | "Female";
  SeniorCitizen: 0 | 1;
  Partner: "Yes" | "No";
  Dependents: "Yes" | "No";
  tenure: number;
  PhoneService: "Yes" | "No";
  MultipleLines: "No" | "Yes" | "No phone service";
  InternetService: "DSL" | "Fiber optic" | "No";
  OnlineSecurity: "No" | "Yes" | "No internet service";
  OnlineBackup: "No" | "Yes" | "No internet service";
  DeviceProtection: "No" | "Yes" | "No internet service";
  TechSupport: "No" | "Yes" | "No internet service";
  StreamingTV: "No" | "Yes" | "No internet service";
  StreamingMovies: "No" | "Yes" | "No internet service";
  Contract: "Month-to-month" | "One year" | "Two year";
  PaperlessBilling: "Yes" | "No";
  PaymentMethod: "Electronic check" | "Mailed check" | "Bank transfer (automatic)" | "Credit card (automatic)";
  MonthlyCharges: number;
  TotalCharges: number;
  Churn?: "Yes" | "No";
  Churn_Binary?: number;
  tenure_group?: string;
}

export interface PredictionResult {
  prediction: "Churn" | "Retained";
  predicted_class: number;
  churn_probability: number;
  churn_percentage: number;
  risk_band: "Low Risk" | "Moderate Risk" | "High Risk";
  decision_threshold: number;
  model_version: string;
  key_factors: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  test_records: number;
}

export interface ModelMetadata {
  model_name: string;
  model_version: string;
  decision_threshold: number;
  metrics: ModelMetrics;
  features: {
    all_features: string[];
    encoded_feature_count: number;
    top_10_features: Record<string, number>;
  };
  all_model_comparison: Record<string, ModelMetrics>;
}
