import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { OverviewTab } from "./components/OverviewTab";
import { CustomerExplorerTab } from "./components/CustomerExplorerTab";
import { PredictorTab } from "./components/PredictorTab";
import { ModelBenchmarksTab } from "./components/ModelBenchmarksTab";
import { AboutTab } from "./components/AboutTab";
import { fetchHealth, fetchKPISummary, fetchAllBreakdowns } from "./services/api";
import type { KPISummary, DimensionItem, CustomerRecord } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [health, setHealth] = useState({ status: "checking...", model_loaded: true, model_name: "XGBoost Classifier" });
  const [kpis, setKpis] = useState<KPISummary>({
    total_customers: 7043,
    churned_customers: 1869,
    retained_customers: 5174,
    churn_rate: 0.2654,
    churn_percentage: 26.54,
    avg_monthly_charges: 64.76,
    total_monthly_revenue: 456116.60,
    churned_monthly_charges: 139130.85,
    avg_tenure_months: 32.4
  });
  const [breakdowns, setBreakdowns] = useState<Record<string, DimensionItem[]>>({});
  const [customerToSimulate, setCustomerToSimulate] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(console.error);
    fetchKPISummary().then(setKpis).catch(console.error);
    fetchAllBreakdowns().then(setBreakdowns).catch(console.error);
  }, []);

  const handleSimulateCustomer = (customer: CustomerRecord) => {
    setCustomerToSimulate(customer);
    setActiveTab("predictor");
  };

  return (
    <>
      <div className="bg-glow-radial" />
      <div className="app-container">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} systemHealth={health} />

        <main>
          {activeTab === "overview" && <OverviewTab kpis={kpis} breakdowns={breakdowns} />}
          {activeTab === "explorer" && <CustomerExplorerTab onSimulateCustomer={handleSimulateCustomer} />}
          {activeTab === "predictor" && <PredictorTab initialData={customerToSimulate} />}
          {activeTab === "models" && <ModelBenchmarksTab />}
          {activeTab === "about" && <AboutTab />}
        </main>
      </div>
    </>
  );
}

export default App;
