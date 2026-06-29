import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = "https://hungryhub-e81l.onrender.com";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const { openSellWindow }            = useContext(GeneralContext);

  useEffect(() => {
    axios.get(`${API_URL}/allHoldings`)
      .then((res) => { setAllHoldings(res.data); setLoading(false); })
      .catch(() => { setError("Failed to load holdings."); setLoading(false); });
  }, []);

  const totalInvestment   = allHoldings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const totalCurrentValue = allHoldings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalPnL          = totalCurrentValue - totalInvestment;
  const totalPnLPercent   =
    totalInvestment > 0
      ? ((totalPnL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  if (loading) return <div className="empty-state">Loading holdings...</div>;
  if (error)   return <div className="empty-state">{error}</div>;

  if (allHoldings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <div className="empty-text">No holdings yet</div>
        <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
          Place a buy order to start building your portfolio
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 500 }}>
          Holdings ({allHoldings.length})
        </div>
      </div>

      <table className="mini-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Instrument</th>
            <th>Qty</th>
            <th>Avg cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&amp;L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allHoldings.map((stock) => {
            const curValue = stock.price * stock.qty;
            const pnl      = curValue - stock.avg * stock.qty;
            const isProfit = pnl >= 0;
            const profClass = isProfit ? "green" : "red";

            return (
              <tr key={stock._id || stock.name}>
                <td style={{ textAlign: "left" }}>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>
                  {isProfit ? "+" : ""}
                  {pnl.toFixed(2)}
                </td>
                <td className={profClass}>{stock.net}</td>
                <td className={stock.isLoss ? "red" : "green"}>{stock.day}</td>
                <td>
                  {/* Sell button navigates to Orders with stock + price pre-filled */}
                  <button
                    className="wl-btn sell-btn"
                    style={{ fontSize: "10px", padding: "3px 8px" }}
                    onClick={() => openSellWindow(stock.name, stock.price)}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Portfolio summary footer */}
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Invested</div>
          <div className="stat-val" style={{ fontSize: "16px" }}>
            ₹{totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Current value</div>
          <div className="stat-val" style={{ fontSize: "16px" }}>
            ₹{totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Total P&amp;L</div>
          <div
            className={`stat-val ${totalPnL >= 0 ? "green" : "red"}`}
            style={{ fontSize: "16px" }}
          >
            {totalPnL >= 0 ? "+" : ""}₹
            {Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            <span style={{ fontSize: "11px" }}>
              ({totalPnL >= 0 ? "+" : ""}
              {totalPnLPercent}%)
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Holdings;