import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // From Watchlist click via Context (or defaults)
  const context = useContext(GeneralContext);
  const [stock, setStock] = useState(context.selectedStockUID || "INFY");
  const [orderType, setOrderType] = useState(context.orderType || "buy"); // buy, sell
  const [priceType, setPriceType] = useState("market"); // market, limit, sl
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(1542.30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update local state if user clicks "B" or "S" from watchlist
  useEffect(() => {
    if (context.selectedStockUID) {
      setStock(context.selectedStockUID);
      setOrderType(context.orderType || "buy");
    }
  }, [context.selectedStockUID, context.orderType]);

  const fetchOrders = () => {
    axios.get(`${API_URL}/orders`).then(r => {
      setOrders(r.data);
      setLoading(false);
    });
  };

  const handlePlaceOrder = async () => {
    if (!stock) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        stock, 
        qty: Number(qty), 
        price: Number(price), 
        type: orderType, 
        orderType: priceType
      });
      // Clear forms context
      context.closeBuyWindow();
      context.closeSellWindow();
      fetchOrders(); // refresh order book
    } catch (err) {
      console.error("Failed to place order:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStock("INFY");
    setQty(1);
    setPrice(1542.30);
    context.closeBuyWindow();
    context.closeSellWindow();
  };

  if (loading) {
    return <div className="empty-state">Loading orders...</div>;
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Orders</div>
      </div>

      <div className="order-form">
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div className="type-toggle" style={{ flex: "0 0 auto", width: "140px" }}>
            <button className={`type-btn ${orderType === "buy" ? "active" : ""}`} onClick={() => setOrderType("buy")}>Buy</button>
            <button className={`type-btn ${orderType === "sell" ? "sell-active" : ""}`} onClick={() => setOrderType("sell")}>Sell</button>
          </div>
          <div className="type-toggle" style={{ flex: "0 0 auto", width: "220px" }}>
            <button className={`type-btn ${priceType === "market" ? (orderType === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setPriceType("market")}>Market</button>
            <button className={`type-btn ${priceType === "limit" ? (orderType === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setPriceType("limit")}>Limit</button>
            <button className={`type-btn ${priceType === "sl" ? (orderType === "buy" ? "active" : "sell-active") : ""}`} onClick={() => setPriceType("sl")}>SL</button>
          </div>
        </div>

        <div className="form-row">
          <span className="form-label">Stock</span>
          <input className="form-input" value={stock} onChange={(e) => setStock(e.target.value.toUpperCase())} />
        </div>
        
        <div className="form-row" style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "8px" }}>
            <span className="form-label" style={{ width: "auto" }}>Qty</span>
            <input className="form-input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "8px" }}>
            <span className="form-label" style={{ width: "auto" }}>@ ₹</span>
            <input className="form-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} disabled={priceType === "market"} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "4px", marginBottom: "12px" }}>
          <span>Margin required</span>
          <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>₹{(qty * price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="action-row">
          <button 
            className={`confirm-btn confirm-${orderType}`} 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `${orderType === "buy" ? "Buy" : "Sell"} ${stock}`}
          </button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>

      <div className="section-title">Order book today</div>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No orders placed today</div>
          <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "4px", fontStyle: "italic" }}>Orders placed here will appear below</div>
        </div>
      ) : (
        <table className="mini-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{order.name}</td>
                <td>
                  <span className={`badge-pill ${order.mode === "BUY" ? "badge-buy" : "badge-sell"}`}>
                    {order.mode}
                  </span>
                </td>
                <td>{order.qty}</td>
                <td>₹{parseFloat(order.price || 0).toFixed(2)}</td>
                <td style={{ color: "var(--color-text-success)", fontWeight: 500 }}>COMPLETE</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Orders;