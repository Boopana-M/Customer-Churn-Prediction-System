import React, { useState } from "react";
import type { PredictionResult, CustomerRecord } from "../types";
import { predictCustomerChurn } from "../services/api";
import { Activity, AlertTriangle, CheckCircle, Flame, Sparkles } from "lucide-react";

interface PredictorTabProps {
  initialData?: Partial<CustomerRecord> | null;
}

const DEFAULT_FORM: Record<string, any> = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "No",
  Dependents: "No",
  tenure: 3,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 79.85,
  TotalCharges: 239.55
};

const HIGH_RISK_PRESET: Record<string, any> = {
  gender: "Female",
  SeniorCitizen: 1,
  Partner: "No",
  Dependents: "No",
  tenure: 2,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 95.50,
  TotalCharges: 191.00
};

const LOW_RISK_PRESET: Record<string, any> = {
  gender: "Male",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "Yes",
  tenure: 64,
  PhoneService: "Yes",
  MultipleLines: "Yes",
  InternetService: "DSL",
  OnlineSecurity: "Yes",
  OnlineBackup: "Yes",
  DeviceProtection: "Yes",
  TechSupport: "Yes",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Two year",
  PaperlessBilling: "No",
  PaymentMethod: "Credit card (automatic)",
  MonthlyCharges: 68.00,
  TotalCharges: 4352.00
};

export const PredictorTab: React.FC<PredictorTabProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData ? { ...DEFAULT_FORM, ...initialData } : DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    // Auto calculate approximate TotalCharges if tenure or monthly changes
    if (field === "tenure" || field === "MonthlyCharges") {
      const ten = field === "tenure" ? Number(value) : Number(formData.tenure);
      const mc = field === "MonthlyCharges" ? Number(value) : Number(formData.MonthlyCharges);
      updated.TotalCharges = Number((ten * mc).toFixed(2));
    }
    setFormData(updated);
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await predictCustomerChurn(formData);
      setResult(res);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.5rem" }}>
      {/* Simulation Form */}
      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Customer Churn Simulator</h2>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              Tune subscriber attributes to simulate real-time model inference and factor breakdown.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: "0.75rem", borderColor: "rgba(244, 63, 94, 0.4)", color: "#fb7185" }}
              onClick={() => setFormData(HIGH_RISK_PRESET)}
            >
              <Flame size={13} />
              <span>High-Risk Profile</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: "0.75rem", borderColor: "rgba(16, 185, 129, 0.4)", color: "#34d399" }}
              onClick={() => setFormData(LOW_RISK_PRESET)}
            >
              <CheckCircle size={13} />
              <span>Low-Risk Profile</span>
            </button>
          </div>
        </div>

        <form onSubmit={handlePredict} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Section 1: Demographics & Account */}
          <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
              1. Customer Profile & Demographics
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Senior Citizen</label>
                <select className="form-select" value={formData.SeniorCitizen} onChange={(e) => handleChange("SeniorCitizen", Number(e.target.value))}>
                  <option value={0}>No (Under 65)</option>
                  <option value={1}>Yes (Senior)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Partner</label>
                <select className="form-select" value={formData.Partner} onChange={(e) => handleChange("Partner", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dependents</label>
                <select className="form-select" value={formData.Dependents} onChange={(e) => handleChange("Dependents", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tenure (Months: {formData.tenure})</label>
                <input
                  type="number"
                  min="0"
                  max="72"
                  className="form-input"
                  value={formData.tenure}
                  onChange={(e) => handleChange("tenure", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Services & Connectivity */}
          <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
              2. Subscribed Services & Features
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">Phone Service</label>
                <select className="form-select" value={formData.PhoneService} onChange={(e) => handleChange("PhoneService", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Multiple Lines</label>
                <select className="form-select" value={formData.MultipleLines} onChange={(e) => handleChange("MultipleLines", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No phone service">No phone service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internet Service</label>
                <select className="form-select" value={formData.InternetService} onChange={(e) => handleChange("InternetService", e.target.value)}>
                  <option value="Fiber optic">Fiber optic</option>
                  <option value="DSL">DSL</option>
                  <option value="No">No Internet</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Online Security</label>
                <select className="form-select" value={formData.OnlineSecurity} onChange={(e) => handleChange("OnlineSecurity", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tech Support</label>
                <select className="form-select" value={formData.TechSupport} onChange={(e) => handleChange("TechSupport", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Streaming TV</label>
                <select className="form-select" value={formData.StreamingTV} onChange={(e) => handleChange("StreamingTV", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Online Backup</label>
                <select className="form-select" value={formData.OnlineBackup} onChange={(e) => handleChange("OnlineBackup", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Device Protection</label>
                <select className="form-select" value={formData.DeviceProtection} onChange={(e) => handleChange("DeviceProtection", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Streaming Movies</label>
                <select className="form-select" value={formData.StreamingMovies} onChange={(e) => handleChange("StreamingMovies", e.target.value)}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Contract & Financials */}
          <div style={{ background: "rgba(15, 23, 42, 0.5)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-emerald)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
              3. Contract, Billing & Charges
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.85rem" }}>
              <div className="form-group">
                <label className="form-label">Contract Term</label>
                <select className="form-select" value={formData.Contract} onChange={(e) => handleChange("Contract", e.target.value)}>
                  <option value="Month-to-month">Month-to-month</option>
                  <option value="One year">One year</option>
                  <option value="Two year">Two year</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Paperless Billing</label>
                <select className="form-select" value={formData.PaperlessBilling} onChange={(e) => handleChange("PaperlessBilling", e.target.value)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select" value={formData.PaymentMethod} onChange={(e) => handleChange("PaymentMethod", e.target.value)}>
                  <option value="Electronic check">Electronic check</option>
                  <option value="Mailed check">Mailed check</option>
                  <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                  <option value="Credit card (automatic)">Credit card (automatic)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Charges ($)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  className="form-input"
                  value={formData.MonthlyCharges}
                  onChange={(e) => handleChange("MonthlyCharges", Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Charges ($)</label>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  className="form-input"
                  value={formData.TotalCharges}
                  onChange={(e) => handleChange("TotalCharges", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ height: "48px" }}>
            <Activity size={18} className={loading ? "spin" : ""} />
            <span>{loading ? "Computing Risk Probability..." : "Run ML Churn Prediction"}</span>
          </button>
        </form>
      </div>

      {/* Prediction Output Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Inference Output</h3>
            {result && (
              <span className={`badge ${result.risk_band === "High Risk" ? "badge-high" : result.risk_band === "Moderate Risk" ? "badge-moderate" : "badge-low"}`}>
                {result.risk_band}
              </span>
            )}
          </div>

          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Risk Percentage Gauge */}
              <div style={{ textAlign: "center", padding: "1.5rem", background: "rgba(15, 23, 42, 0.6)", borderRadius: "1rem", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  Estimated Churn Probability
                </div>
                <div
                  style={{
                    fontSize: "3.25rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-sans)",
                    color: result.risk_band === "High Risk" ? "#fb7185" : result.risk_band === "Moderate Risk" ? "#fbbf24" : "#34d399",
                    textShadow: `0 0 25px ${result.risk_band === "High Risk" ? "rgba(244, 63, 94, 0.4)" : "rgba(16, 185, 129, 0.4)"}`
                  }}
                >
                  {result.churn_percentage}%
                </div>

                <div className="progress-track" style={{ height: "0.75rem", margin: "1rem 0" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${result.churn_percentage}%`,
                      background: result.risk_band === "High Risk" ? "linear-gradient(90deg, #f59e0b, #f43f5e)" : "linear-gradient(90deg, #10b981, #38bdf8)",
                      boxShadow: "0 0 12px rgba(56, 189, 248, 0.5)"
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span>0% (Safe)</span>
                  <span>Threshold: 50%</span>
                  <span>100% (Certain)</span>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.6rem" }}>
                  Contributing Risk Drivers
                </span>
                {result.key_factors.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {result.key_factors.map((factor, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.825rem", padding: "0.6rem 0.75rem", background: "rgba(244, 63, 94, 0.07)", borderRadius: "0.5rem", borderLeft: "3px solid #f43f5e" }}>
                        <AlertTriangle size={15} color="#f43f5e" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", padding: "0.6rem 0.75rem", background: "rgba(16, 185, 129, 0.07)", borderRadius: "0.5rem", borderLeft: "3px solid #10b981" }}>
                    <CheckCircle size={15} color="#10b981" />
                    <span>Multi-year commitment and balanced services indicate high retention stability.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <Sparkles size={32} color="var(--accent-cyan)" opacity={0.6} />
              <p style={{ fontSize: "0.875rem" }}>
                Adjust the input fields on the left and click <strong>Run ML Churn Prediction</strong> to generate real-time risk assessment.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer Card */}
        <div className="glass-card" style={{ padding: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>
            Model Disclaimer:
          </strong>
          Predicted probabilities represent statistical estimates derived from historical IBM Telco data patterns. They do not constitute deterministic guarantees of individual customer action.
        </div>
      </div>
    </div>
  );
};
