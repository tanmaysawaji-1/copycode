import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const { openSellWindow }              = useContext(GeneralContext);

  useEffect(() => {
    axios.get(`${API_URL}/allPositions`)
      .then((res) => { setAllPositions(res.data); setLoading(false); })
      .catch(() => { setError("Failed to load positions."); setLoading(false); });
  }, []);

  const totalPnL = allPositions.reduce((sum, s) => {
    const curValue = s.price * s.qty;
    return sum + (curValue - s.avg * s.qty);
  }, 0);

  if (loading) return <div className="empty-state">Loading positions...</div>;
  if (error)   return <div className="empty-state">{error}</div>;

  if (allPositions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <div className="empty-text">No open positions</div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            marginTop: "4px",
          }}
        >
          Intraday positions will appear here
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
          Positions ({allPositions.length})
        </div>
        <div style={{ fontSize: "11px" }}>
          Day P&amp;L:{" "}
          <span
            style={{
              fontWeight: 500,
              color:
                totalPnL >= 0
                  ? "var(--color-text-success)"
                  : "var(--color-text-danger)",
            }}
          >
            {totalPnL >= 0 ? "+" : ""}₹
            {Math.abs(totalPnL).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <table className="mini-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{ textAlign: "left" }}>Instrument</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&amp;L</th>
            <th>Chg.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allPositions.map((stock) => {
            const curValue  = stock.price * stock.qty;
            const pnl       = curValue - stock.avg * stock.qty;
            const isProfit  = pnl >= 0;
            const profClass = isProfit ? "green" : "red";

            return (
              <tr key={stock._id || stock.name}>
                <td>
                  <span
                    className={`badge-pill ${
                      stock.product === "MIS" ? "badge-sell" : "badge-buy"
                    }`}
                  >
                    {stock.product}
                  </span>
                </td>
                <td style={{ textAlign: "left" }}>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={profClass}>
                  {isProfit ? "+" : ""}
                  {pnl.toFixed(2)}
                </td>
                <td className={stock.isLoss ? "red" : "green"}>{stock.day}</td>
                <td>
                  {/* Exit button — opens sell order for this position */}
                  <button
                    className="wl-btn sell-btn"
                    style={{ fontSize: "10px", padding: "3px 8px" }}
                    onClick={() => openSellWindow(stock.name, stock.price)}
                    title={`Exit ${stock.name} position`}
                  >
                    Exit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Positions;
