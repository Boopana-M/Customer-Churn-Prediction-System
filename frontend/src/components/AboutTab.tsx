import React from "react";
import { Database, Layers, ShieldCheck, Code2, Cpu, Globe } from "lucide-react";

export const AboutTab: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Overview Card */}
      <div className="glass-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div className="brand-icon" style={{ width: "2.25rem", height: "2.25rem" }}>
            <Layers size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem" }}>Platform Architecture & Methodology</h2>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              An enterprise-grade, end-to-end Machine Learning and Business Intelligence solution for subscription churn analysis.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginTop: "1.25rem" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>
              <Database size={16} />
              <strong style={{ fontSize: "0.9rem" }}>1. Data Engineering</strong>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Data verification, clean ingestion of 7,043 customer records, conversion of whitespace strings in TotalCharges to zero with zero dropped rows, cohort band creation.
            </p>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-purple)", marginBottom: "0.5rem" }}>
              <Cpu size={16} />
              <strong style={{ fontSize: "0.9rem" }}>2. ML Pipelines</strong>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Stratified 80/20 train/test evaluation across Logistic Regression, Decision Trees, Random Forest, and XGBoost with Joblib serialization and metric metadata tracking.
            </p>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-emerald)", marginBottom: "0.5rem" }}>
              <Code2 size={16} />
              <strong style={{ fontSize: "0.9rem" }}>3. FastAPI Backend</strong>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Asynchronous RESTful microservice with Pydantic v2 validation, single and batch prediction routes, analytics aggregations, and OpenAPI documentation.
            </p>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-amber)", marginBottom: "0.5rem" }}>
              <Globe size={16} />
              <strong style={{ fontSize: "0.9rem" }}>4. React + BI Delivery</strong>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Modern dark-mode UI with live simulations, customer directory query, and unified cross-compatible datasets prepared for Tableau and Power BI Desktop.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Tech Stack Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Dataset Specifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <div><strong>Source:</strong> IBM Telco Customer Churn (Kaggle)</div>
            <div><strong>Total Records:</strong> 7,043 unique customer accounts</div>
            <div><strong>Features:</strong> 21 raw columns (Demographics, Services, Contracts, Billing)</div>
            <div><strong>Target Class:</strong> Churn (`Yes` = 26.54%, `No` = 73.46%)</div>
            <div><strong>Data Quality:</strong> 11 zero-tenure records cleaned to TotalCharges = 0.0</div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Technology Stack</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <div><strong>Languages:</strong> Python 3.10+, TypeScript 5+</div>
            <div><strong>Data Science & ML:</strong> Pandas, NumPy, Scikit-learn, XGBoost, Matplotlib, Seaborn</div>
            <div><strong>Backend API:</strong> FastAPI, Pydantic, Uvicorn, Pytest</div>
            <div><strong>Frontend:</strong> React 18, Vite, Lucide Icons, Vanilla CSS Dark Theme</div>
            <div><strong>BI Dashboards:</strong> Tableau Desktop / Public, Microsoft Power BI Desktop</div>
          </div>
        </div>
      </div>

      {/* Governance & Causality Guardrail */}
      <div className="glass-card" style={{ borderLeft: "4px solid var(--accent-cyan)", background: "rgba(15, 23, 42, 0.7)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)", marginBottom: "0.4rem" }}>
          <ShieldCheck size={18} />
          <strong style={{ fontSize: "0.95rem" }}>Governance & Interpretation Guardrails</strong>
        </div>
        <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          This system provides educational and analytical intelligence based strictly on the IBM Telco open dataset. Machine learning probability scores represent empirical correlations and do not imply proven causal mechanisms without formal randomized A/B intervention trials.
        </p>
      </div>
    </div>
  );
};
