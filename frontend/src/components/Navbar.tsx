import React from "react";
import { Activity, BarChart3, Users, Cpu, Info } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemHealth: { status: string; model_loaded: boolean; model_name: string };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemHealth }) => {
  const tabs = [
    { id: "overview", label: "Executive Overview", icon: BarChart3 },
    { id: "explorer", label: "Customer Explorer", icon: Users },
    { id: "predictor", label: "Prediction Simulator", icon: Activity },
    { id: "models", label: "Model Benchmarks", icon: Cpu },
    { id: "about", label: "Architecture & About", icon: Info },
  ];

  return (
    <header className="header-nav">
      <div className="brand-badge">
        <div className="brand-icon">
          <Activity size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Customer <span className="gradient-text-cyan">Churn Intelligence</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.15rem" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              {systemHealth.model_name} (v1.0.0) • Connected
            </span>
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
