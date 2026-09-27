import React, { useState, useEffect } from "react";
import type { CustomerRecord } from "../types";
import { fetchCustomers } from "../services/api";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, RefreshCw } from "lucide-react";

interface CustomerExplorerTabProps {
  onSimulateCustomer?: (customer: CustomerRecord) => void;
}

export const CustomerExplorerTab: React.FC<CustomerExplorerTabProps> = ({ onSimulateCustomer }) => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [contract, setContract] = useState("All");
  const [internetService, setInternetService] = useState("All");
  const [churnStatus, setChurnStatus] = useState("All");

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCustomers(page, 20, search, contract, internetService, churnStatus);
      setCustomers(res.customers);
      setTotalCount(res.total_count);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error("Failed to load customer list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, contract, internetService, churnStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Search & Filters Bar */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: "2", minWidth: "220px" }}>
            <label className="form-label">Search Customer ID</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="e.g. 7590-VHVEG"
                className="form-input"
                style={{ paddingLeft: "2.25rem" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div className="form-group" style={{ flex: "1", minWidth: "150px" }}>
            <label className="form-label">Contract Type</label>
            <select className="form-select" value={contract} onChange={(e) => { setContract(e.target.value); setPage(1); }}>
              <option value="All">All Contracts</option>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: "1", minWidth: "150px" }}>
            <label className="form-label">Internet Service</label>
            <select className="form-select" value={internetService} onChange={(e) => { setInternetService(e.target.value); setPage(1); }}>
              <option value="All">All Services</option>
              <option value="DSL">DSL</option>
              <option value="Fiber optic">Fiber optic</option>
              <option value="No">No Internet</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: "1", minWidth: "140px" }}>
            <label className="form-label">Historical Churn</label>
            <select className="form-select" value={churnStatus} onChange={(e) => { setChurnStatus(e.target.value); setPage(1); }}>
              <option value="All">All Statuses</option>
              <option value="Yes">Churned (Yes)</option>
              <option value="No">Retained (No)</option>
            </select>
          </div>

          <button type="submit" className="btn-secondary" style={{ height: "42px" }}>
            <Filter size={15} />
            <span>Apply</span>
          </button>
        </form>
      </div>

      {/* Customer Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Customer Directory</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Showing {customers.length} of {totalCount.toLocaleString()} matching verified customer accounts
            </p>
          </div>
          <button className="btn-secondary" onClick={loadData} disabled={loading} style={{ padding: "0.4rem 0.8rem" }}>
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="table-container" style={{ border: "none" }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Gender / Senior</th>
                <th>Tenure</th>
                <th>Contract</th>
                <th>Internet Service</th>
                <th>Payment Method</th>
                <th>Monthly</th>
                <th>Total Charges</th>
                <th>Historical Churn</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customerID}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent-cyan)" }}>
                    {c.customerID}
                  </td>
                  <td>
                    {c.gender} {c.SeniorCitizen === 1 ? "• Senior" : ""}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{c.tenure}</span> mos
                  </td>
                  <td>
                    <span className={`badge ${c.Contract === "Month-to-month" ? "badge-high" : "badge-low"}`}>
                      {c.Contract}
                    </span>
                  </td>
                  <td>{c.InternetService}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.PaymentMethod}</td>
                  <td style={{ fontWeight: 700 }}>${c.MonthlyCharges?.toFixed(2)}</td>
                  <td style={{ color: "var(--text-secondary)" }}>${c.TotalCharges?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${c.Churn === "Yes" ? "badge-high" : "badge-low"}`}>
                      {c.Churn === "Yes" ? "Churned" : "Retained"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        onClick={() => setSelectedCustomer(c)}
                      >
                        <Eye size={12} />
                        <span>Details</span>
                      </button>
                      {onSimulateCustomer && (
                        <button
                          className="btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
                          onClick={() => onSimulateCustomer(c)}
                        >
                          <span>Simulate</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-secondary"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ opacity: page <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button
              className="btn-secondary"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: page >= totalPages ? 0.4 : 1 }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem"
          }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              background: "#0f172a",
              border: "1px solid var(--border-active)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem" }}>Customer Profile</h3>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", fontSize: "0.9rem" }}>
                  {selectedCustomer.customerID}
                </span>
              </div>
              <span className={`badge ${selectedCustomer.Churn === "Yes" ? "badge-high" : "badge-low"}`}>
                Historical Status: {selectedCustomer.Churn === "Yes" ? "Churned" : "Retained"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Demographics</span>
                <strong>{selectedCustomer.gender}, {selectedCustomer.SeniorCitizen ? "Senior Citizen" : "Non-Senior"}</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Partner: {selectedCustomer.Partner} • Dependents: {selectedCustomer.Dependents}
                </div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Tenure & Contract</span>
                <strong>{selectedCustomer.tenure} Months</strong> ({selectedCustomer.Contract})
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Connectivity & Security</span>
                <strong>{selectedCustomer.InternetService} Internet</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Tech Support: {selectedCustomer.TechSupport} • Security: {selectedCustomer.OnlineSecurity}
                </div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Billing & Financials</span>
                <strong>${selectedCustomer.MonthlyCharges?.toFixed(2)}/mo</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Total: ${selectedCustomer.TotalCharges?.toFixed(2)} • {selectedCustomer.PaymentMethod}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button className="btn-secondary" onClick={() => setSelectedCustomer(null)}>
                Close
              </button>
              {onSimulateCustomer && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    const c = selectedCustomer;
                    setSelectedCustomer(null);
                    onSimulateCustomer(c);
                  }}
                >
                  <span>Simulate in Churn Engine</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
