import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/allPositions`)
      .then((res) => { setAllPositions(res.data); setLoading(false); })
      .catch((err) => { setError("Failed to load"); setLoading(false); });
  }, []);

  if (loading) return <div className="empty-state">Loading positions...</div>;
  if (error) return <div className="empty-state">{error}</div>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Positions ({allPositions.length})</div>
      </div>

      <table className="mini-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>
        </thead>
        <tbody>
          {allPositions.map((stock) => {
            const curValue = stock.price * stock.qty;
            const isProfit = (curValue - stock.avg * stock.qty) >= 0;
            const profClass = isProfit ? "green" : "red";
            return (
              <tr key={stock._id || stock.name}>
                <td><span className={`badge-pill ${stock.product === "MIS" ? "badge-sell" : "badge-buy"}`}>{stock.product}</span></td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={profClass}>{(curValue - stock.avg * stock.qty).toFixed(2)}</td>
                <td className={stock.isLoss ? "red" : "green"}>{stock.day}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Positions;