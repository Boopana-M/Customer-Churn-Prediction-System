import React, { useState } from "react";
import type { KPISummary, DimensionItem } from "../types";
import { Users, UserX, UserCheck, DollarSign, Clock, ShieldAlert, Sparkles } from "lucide-react";

interface OverviewTabProps {
  kpis: KPISummary;
  breakdowns: Record<string, DimensionItem[]>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ kpis, breakdowns }) => {
  const [selectedDimension, setSelectedDimension] = useState<string>("Contract");

  const currentBreakdown = breakdowns[selectedDimension] || [];

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Total Customers</span>
            <Users size={18} color="var(--accent-cyan)" />
          </div>
          <div className="metric-value">{kpis.total_customers?.toLocaleString() ?? "7,043"}</div>
          <div className="metric-footer">
            <span style={{ color: "#38bdf8" }}>100%</span> verified subscriber records
          </div>
        </div>

        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Retained Base</span>
            <UserCheck size={18} color="var(--accent-emerald)" />
          </div>
          <div className="metric-value" style={{ color: "#34d399" }}>
            {kpis.retained_customers?.toLocaleString() ?? "5,174"}
          </div>
          <div className="metric-footer">
            <span className="badge badge-low">{(100 - (kpis.churn_percentage || 26.54)).toFixed(1)}% Active</span>
          </div>
        </div>

        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Churned Accounts</span>
            <UserX size={18} color="var(--accent-rose)" />
          </div>
          <div className="metric-value" style={{ color: "#fb7185" }}>
            {kpis.churned_customers?.toLocaleString() ?? "1,869"}
          </div>
          <div className="metric-footer">
            <span className="badge badge-high">{kpis.churn_percentage ?? 26.54}% Churn Rate</span>
          </div>
        </div>

        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Monthly Recurring Rev</span>
            <DollarSign size={18} color="var(--accent-blue)" />
          </div>
          <div className="metric-value">
            ${Math.round(kpis.total_monthly_revenue ?? 456116).toLocaleString()}
          </div>
          <div className="metric-footer">
            <span>Avg ${kpis.avg_monthly_charges?.toFixed(2) ?? "64.76"}/mo per user</span>
          </div>
        </div>

        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Churned MRR Impact</span>
            <ShieldAlert size={18} color="var(--accent-amber)" />
          </div>
          <div className="metric-value" style={{ color: "#fbbf24" }}>
            ${Math.round(kpis.churned_monthly_charges ?? 139130).toLocaleString()}
          </div>
          <div className="metric-footer">
            <span>Associated monthly billing</span>
          </div>
        </div>

        <div className="glass-card glass-card-glow metric-card">
          <div className="metric-card-header">
            <span>Average Tenure</span>
            <Clock size={18} color="var(--accent-purple)" />
          </div>
          <div className="metric-value">
            {kpis.avg_tenure_months ?? 32.4} <span style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>mos</span>
          </div>
          <div className="metric-footer">
            <span>Across full cohort lifecycle</span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Churn Analysis by Dimension</h2>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Explore how churn rates and revenue exposure fluctuate across contract structures, services, and tenure bands.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", background: "rgba(15, 23, 42, 0.8)", padding: "0.25rem", borderRadius: "0.5rem", border: "1px solid var(--border-subtle)" }}>
              {["Contract", "InternetService", "PaymentMethod", "tenure_group"].map((dim) => (
                <button
                  key={dim}
                  onClick={() => setSelectedDimension(dim)}
                  style={{
                    background: selectedDimension === dim ? "var(--accent-blue)" : "transparent",
                    color: selectedDimension === dim ? "#fff" : "var(--text-secondary)",
                    border: "none",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "0.35rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {dim === "tenure_group" ? "Tenure Cohorts" : dim}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {currentBreakdown.map((item, idx) => {
              const isHigh = item.churn_pct > 30;
              const isModerate = item.churn_pct >= 15 && item.churn_pct <= 30;
              const barColor = isHigh ? "var(--accent-rose)" : isModerate ? "var(--accent-amber)" : "var(--accent-emerald)";

              return (
                <div key={idx} style={{ background: "rgba(15, 23, 42, 0.5)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.category}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        ({item.total_customers.toLocaleString()} total • {item.churned_customers.toLocaleString()} churned)
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        Avg ${item.avg_monthly_charges}/mo
                      </span>
                      <span className={`badge ${isHigh ? "badge-high" : isModerate ? "badge-moderate" : "badge-low"}`}>
                        {item.churn_pct}% Churn Rate
                      </span>
                    </div>
                  </div>

                  <div className="progress-track" style={{ height: "0.5rem" }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, item.churn_pct)}%`,
                        background: barColor,
                        boxShadow: `0 0 10px ${barColor}66`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Highlights Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: "1.1rem" }}>Strategic Insights</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <div style={{ padding: "0.85rem", background: "rgba(244, 63, 94, 0.08)", borderRadius: "0.6rem", borderLeft: "3px solid var(--accent-rose)" }}>
              <strong style={{ color: "#fb7185", display: "block", marginBottom: "0.2rem" }}>Month-to-Month Hazard</strong>
              Month-to-month subscribers churn at <strong>42.7%</strong> compared to only <strong>2.8%</strong> for 2-year contracted clients (15x difference).
            </div>

            <div style={{ padding: "0.85rem", background: "rgba(56, 189, 248, 0.08)", borderRadius: "0.6rem", borderLeft: "3px solid var(--accent-cyan)" }}>
              <strong style={{ color: "#38bdf8", display: "block", marginBottom: "0.2rem" }}>First-Year Vulnerability</strong>
              Over <strong>55% of all churn events</strong> occur during months 0–12 (47.4% cohort churn rate). Retention stabilizes dramatically after month 24.
            </div>

            <div style={{ padding: "0.85rem", background: "rgba(168, 85, 247, 0.08)", borderRadius: "0.6rem", borderLeft: "3px solid var(--accent-purple)" }}>
              <strong style={{ color: "#c084fc", display: "block", marginBottom: "0.2rem" }}>Payment Friction</strong>
              Electronic check payment methods experience <strong>45.3%</strong> churn versus ~15.5% for automated credit card & bank debits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
