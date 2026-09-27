import React, { useState, useEffect } from "react";
import type { ModelMetadata } from "../types";
import { fetchModelMetadata } from "../services/api";
import { Award } from "lucide-react";

export const ModelBenchmarksTab: React.FC = () => {
  const [meta, setMeta] = useState<ModelMetadata | null>(null);

  useEffect(() => {
    fetchModelMetadata().then(setMeta).catch(console.error);
  }, []);

  if (!meta) {
    return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading model benchmarks...</div>;
  }

  const comparison = meta.all_model_comparison || {};
  const cm = meta.metrics.confusion_matrix;
  const topFeatures = meta.features?.top_10_features || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Champion Model Banner */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
          border: "1px solid var(--border-active)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-blue">
              <Award size={13} /> Selected Champion Model
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              v{meta.model_version} • Stratified 80/20 Test
            </span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            {meta.model_name} <span className="gradient-text-cyan">Ensemble Pipeline</span>
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "600px", marginTop: "0.3rem" }}>
            Trained with gradient-boosted decision trees and class weight adjustment to optimize churn detection recall while maintaining high discriminative ROC-AUC.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>ROC-AUC</span>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
              {(meta.metrics.roc_auc * 100).toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Churn Recall</span>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34d399" }}>
              {(meta.metrics.recall * 100).toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>F1-Score</span>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#c084fc" }}>
              {(meta.metrics.f1_score * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 style={{ fontSize: "1.1rem" }}>Candidate Model Benchmark Comparison</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Evaluated on the exact same held-out test split (1,409 customers) using consistent preprocessing pipelines.
          </p>
        </div>

        <div className="table-container" style={{ border: "none" }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall (Sensitivity)</th>
                <th>F1-Score</th>
                <th>ROC-AUC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparison).map(([name, m]) => {
                const isChampion = name === meta.model_name;
                return (
                  <tr key={name} style={{ background: isChampion ? "rgba(56, 189, 248, 0.05)" : "transparent" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong>{name}</strong>
                        {isChampion && (
                          <span className="badge badge-blue" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                            Champion
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{(m.accuracy * 100).toFixed(2)}%</td>
                    <td>{(m.precision * 100).toFixed(2)}%</td>
                    <td style={{ color: "#34d399", fontWeight: 600 }}>{(m.recall * 100).toFixed(2)}%</td>
                    <td>{(m.f1_score * 100).toFixed(2)}%</td>
                    <td style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>{(m.roc_auc * 100).toFixed(2)}%</td>
                    <td>
                      <span className={`badge ${isChampion ? "badge-low" : "badge-moderate"}`}>
                        {isChampion ? "Deployed" : "Evaluated"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Feature Importances */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem" }}>
        {/* Confusion Matrix Visual */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Test Set Confusion Matrix</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Classification breakdown across {meta.metrics.test_records} evaluated customer test instances.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>True Negatives</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399", margin: "0.25rem 0" }}>
                {cm.true_negatives}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Correctly Retained</span>
            </div>

            <div style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>False Positives</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fb7185", margin: "0.25rem 0" }}>
                {cm.false_positives}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Retained Flagged as Churn</span>
            </div>

            <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>False Negatives</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fbbf24", margin: "0.25rem 0" }}>
                {cm.false_negatives}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Churned Missed</span>
            </div>

            <div style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>True Positives</span>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8", margin: "0.25rem 0" }}>
                {cm.true_positives}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Correctly Flagged Churn</span>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Top Predictive Feature Weights</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Relative mathematical importance derived from the XGBoost ensemble tree splits.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Object.entries(topFeatures).slice(0, 7).map(([feat, weight], idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{feat}</span>
                  <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>{(weight * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-track" style={{ height: "0.45rem" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (weight / 0.35) * 100)}%`,
                      background: "linear-gradient(90deg, #3b82f6, #38bdf8)"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
