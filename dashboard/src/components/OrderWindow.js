import React, { useContext, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL ="https://hungryhub-e81l.onrender.com";

const OrderWindow = ({ type }) => {
  const { selectedStockUID, closeBuyWindow, closeSellWindow } = useContext(GeneralContext);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        stock: selectedStockUID, 
        qty: Number(qty), 
        price: Number(price), 
        type: type, 
        orderType
      });
      type === "buy" ? closeBuyWindow() : closeSellWindow();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    type === "buy" ? closeBuyWindow() : closeSellWindow();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={handleClose}>
      
      <div 
        className="order-form" 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: "320px", marginBottom: 0, border: `1px solid var(--color-border-${type === "buy" ? "info" : "danger"})` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          <h3 style={{ textTransform: "capitalize", fontSize: "14px", fontWeight: 500 }}>{type} {selectedStockUID}</h3>
          <button style={{ background: "transparent", border: "none", color: "var(--color-text-secondary)", cursor: "pointer" }} onClick={handleClose}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
          <div className="type-toggle" style={{ flex: 1 }}>
            <button className={`type-btn ${orderType === "market" ? (type === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setOrderType("market")}>Market</button>
            <button className={`type-btn ${orderType === "limit" ? (type === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setOrderType("limit")}>Limit</button>
            <button className={`type-btn ${orderType === "sl" ? (type === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setOrderType("sl")}>SL</button>
          </div>
        </div>

        <div className="form-row">
          <span className="form-label" style={{ width: "40px" }}>Qty</span>
          <input className="form-input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        
        <div className="form-row">
          <span className="form-label" style={{ width: "40px" }}>Price</span>
          <input className="form-input" type="number" placeholder="At Market" value={price} onChange={(e) => setPrice(e.target.value)} disabled={orderType === "market"} />
        </div>
        
        <div className="action-row">
          <button 
            className={`confirm-btn confirm-${type}`} 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? "..." : `${type === "buy" ? "Buy" : "Sell"} ${selectedStockUID}`}
          </button>
          <button className="cancel-btn" onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default OrderWindow;