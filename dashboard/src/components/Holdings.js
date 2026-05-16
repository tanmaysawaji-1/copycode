import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/allHoldings`)
      .then((res) => { setAllHoldings(res.data); setLoading(false); })
      .catch((err) => { setError("Failed to load"); setLoading(false); });
  }, []);

  const totalInvestment = allHoldings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const totalCurrentValue = allHoldings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalPnL = totalCurrentValue - totalInvestment;
  const totalPnLPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : "0.00";

  if (loading) return <div className="empty-state">Loading holdings...</div>;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Holdings ({allHoldings.length})</div>
      </div>

      <table className="mini-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
        </thead>
        <tbody>
          {allHoldings.map((stock) => {
            const curValue = stock.price * stock.qty;
            const isProfit = (curValue - stock.avg * stock.qty) >= 0;
            const profClass = isProfit ? "green" : "red";
            return (
              <tr key={stock._id || stock.name}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>{(curValue - stock.avg * stock.qty).toFixed(2)}</td>
                <td className={profClass}>{stock.net}</td>
                <td className={stock.isLoss ? "red" : "green"}>{stock.day}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Invested</div>
          <div className="stat-val" style={{ fontSize: "16px" }}>₹{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Current</div>
          <div className="stat-val" style={{ fontSize: "16px" }}>₹{totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">P&L</div>
          <div className={`stat-val ${totalPnL >= 0 ? "green" : "red"}`} style={{ fontSize: "16px" }}>
            {totalPnL >= 0 ? "+" : ""}
            ₹{Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px" }}>({totalPnL >= 0 ? "+" : ""}{totalPnLPercent}%)</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Holdings;