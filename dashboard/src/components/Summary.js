import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = "https://hungryhub-e81l.onrender.com";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = getCookie("username") || "User";

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_URL}/summary`, { signal: controller.signal })
      .then((r) => { setSummary(r.data); setLoading(false); })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Failed to load summary", err);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const pnlPositive = (summary?.pnl ?? 0) >= 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 500 }}>
          {greeting}, {username} 👋
        </div>
      </div>

      {/* KPI cards */}
      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Available cash</div>
          <div className="stat-val" style={{ color: "var(--color-text-info)" }}>
            {loading
              ? "—"
              : summary?.availableCash != null
              ? `₹${summary.availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "—"}
          </div>
          <div className="stat-sub">Equity</div>
        </div>

        <div className="stat">
          <div className="stat-label">Total equity</div>
          <div className="stat-val">
            {loading
              ? "—"
              : summary?.totalEquity != null
              ? `₹${summary.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "—"}
          </div>
          <div className="stat-sub">Holdings value</div>
        </div>

        <div className="stat">
          <div className="stat-label">Today's P&amp;L</div>
          <div className={`stat-val ${pnlPositive ? "green" : "red"}`}>
            {loading
              ? "—"
              : summary?.pnl != null
              ? `${pnlPositive ? "+₹" : "-₹"}${Math.abs(summary.pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "—"}
          </div>
          <div className={`stat-sub ${pnlPositive ? "green" : "red"}`}>
            {summary?.pnlPercent
              ? `${pnlPositive ? "+" : ""}${summary.pnlPercent}%`
              : ""}
          </div>
        </div>
      </div>

      {/* 7-day trend chart */}
      {summary?.trend?.length > 0 && (
        <>
          <div className="section-title">7-day portfolio trend</div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-text-info)"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-background-primary)",
                    border: "1px solid var(--color-border-secondary)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "var(--color-text-primary)" }}
                  formatter={(v) => [`₹${v?.toLocaleString()}`, "Value"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Top movers — from API, falls back to empty state */}
      <div className="section-title">Top movers today</div>
      {loading ? (
        <div className="empty-state" style={{ padding: "16px 0" }}>
          Loading...
        </div>
      ) : summary?.topMovers?.length > 0 ? (
        <table className="mini-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Stock</th>
              <th>Price</th>
              <th>Day chg.</th>
              <th>P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {summary.topMovers.map((s, i) => {
              const isUp = !s.isLoss;
              return (
                <tr key={i}>
                  <td style={{ textAlign: "left" }}>{s.name}</td>
                  <td>
                    {s.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className={isUp ? "green" : "red"}>{s.day}</td>
                  <td className={isUp ? "green" : "red"}>
                    {s.pnl != null
                      ? `${isUp ? "+" : "-"}₹${Math.abs(s.pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div
          className="empty-state"
          style={{ padding: "16px 0", fontSize: "12px" }}
        >
          No holdings data yet. Place some buy orders to see movers here.
        </div>
      )}
    </>
  );
};

export default Summary;