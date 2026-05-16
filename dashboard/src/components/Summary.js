import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Summary = () => {
  const [summary, setSummary] = useState(null);
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  const username = getCookie("username") || "User";

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_URL}/summary`, { signal: controller.signal })
      .then(r => setSummary(r.data))
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Failed to load summary", err);
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Good morning, {username}</div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Available cash</div>
          <div className="stat-val" style={{ color: "var(--color-text-info)" }}>
            {summary?.availableCash ? `₹${summary.availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}
          </div>
          <div className="stat-sub">Equity</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Equity</div>
          <div className="stat-val">
            {summary?.totalEquity ? `₹${summary.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}
          </div>
          <div className="stat-sub">Holdings</div>
        </div>
        <div className="stat">
          <div className="stat-label">Today's P&L</div>
          <div className={`stat-val ${summary?.pnl >= 0 ? "green" : "red"}`}>
            {summary?.pnl ? (summary.pnl >= 0 ? "+₹" : "-₹") + Math.abs(summary.pnl).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"}
          </div>
          <div className={`stat-sub ${summary?.pnl >= 0 ? "green" : "red"}`}>{summary?.pnl >= 0 ? "+5.20%" : "-1.10%"}</div>
        </div>
      </div>

      <div className="section-title">7-day portfolio trend</div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={summary?.trend}>
            <Line type="monotone" dataKey="value" stroke="var(--color-text-info)" strokeWidth={2} dot={false} />
            <Tooltip
              contentStyle={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: "4px", fontSize: "12px" }}
              itemStyle={{ color: "var(--color-text-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="section-title">Top movers today</div>
      <table className="mini-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price</th>
            <th>Day chg.</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>INFY</td><td>1,542.30</td><td className="green">+2.1%</td><td className="green">+₹620</td></tr>
          <tr><td>TCS</td><td>3,821.00</td><td className="red">-0.8%</td><td className="red">-₹241</td></tr>
          <tr><td>HDFCBANK</td><td>1,670.45</td><td className="green">+1.3%</td><td className="green">+₹389</td></tr>
        </tbody>
      </table>
    </>
  );
};

export default Summary;