import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const Orders = () => {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [availableCash, setAvailableCash] = useState(null);
  const [msg, setMsg]                 = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const context = useContext(GeneralContext);

  // Form state — initialised from context when stock is selected from Watchlist
  const [stock, setStock]         = useState(context.selectedStockUID || "");
  const [orderType, setOrderType] = useState(context.orderType || "buy");
  const [priceType, setPriceType] = useState("market");
  const [qty, setQty]             = useState(1);
  const [price, setPrice]         = useState(context.selectedStockPrice || 0);

  // Sync with context whenever user clicks B/S from watchlist
  useEffect(() => {
    if (context.selectedStockUID) {
      setStock(context.selectedStockUID);
      setOrderType(context.orderType || "buy");
      setPrice(context.selectedStockPrice || 0);
      setMsg({ type: "", text: "" });
    }
  }, [context.selectedStockUID, context.orderType, context.selectedStockPrice]);

  // Fetch order book and available funds on mount
  useEffect(() => {
    fetchOrders();
    fetchAvailableCash();
  }, []);

  const fetchOrders = () => {
    axios.get(`${API_URL}/orders`)
      .then((r) => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchAvailableCash = () => {
    axios.get(`${API_URL}/funds`)
      .then((r) => setAvailableCash(r.data?.funds?.availableCash ?? null))
      .catch(() => {}); // non-fatal
  };

  const totalCost = Number(qty) * Number(price);

  const validate = () => {
    if (!stock.trim()) {
      setMsg({ type: "error", text: "Please enter a stock symbol." });
      return false;
    }
    if (Number(qty) < 1) {
      setMsg({ type: "error", text: "Quantity must be at least 1." });
      return false;
    }
    if (priceType !== "market" && Number(price) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid price." });
      return false;
    }
    if (orderType === "buy" && availableCash !== null && totalCost > availableCash) {
      setMsg({ type: "error", text: `Insufficient funds. Available: ₹${availableCash.toLocaleString()}` });
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setMsg({ type: "", text: "" });
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        stock: stock.toUpperCase(),
        qty: Number(qty),
        price: priceType === "market" ? Number(price) : Number(price),
        type: orderType,
        orderType: priceType,
      });

      setMsg({
        type: "success",
        text: `${orderType === "buy" ? "Buy" : "Sell"} order for ${stock.toUpperCase()} placed!`,
      });

      // Reset context selection
      context.closeBuyWindow();
      context.closeSellWindow();

      // Refresh order book and funds balance
      fetchOrders();
      fetchAvailableCash();

      // Clear form after success
      setTimeout(() => {
        setStock("");
        setQty(1);
        setPrice(0);
        setMsg({ type: "", text: "" });
      }, 2500);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to place order. Please try again.";
      setMsg({ type: "error", text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStock("");
    setQty(1);
    setPrice(0);
    setMsg({ type: "", text: "" });
    context.closeBuyWindow();
    context.closeSellWindow();
  };

  if (loading) return <div className="empty-state">Loading orders...</div>;

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
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Orders</div>
        {availableCash !== null && (
          <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
            Available:{" "}
            <span style={{ color: "var(--color-text-info)", fontWeight: 500 }}>
              ₹{availableCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Feedback message */}
      {msg.text && (
        <div
          className={`modal-alert ${msg.type}`}
          style={{ marginBottom: "12px", borderRadius: "4px", padding: "8px 12px", fontSize: "12px" }}
        >
          {msg.text}
        </div>
      )}

      <div className="order-form">
        {/* Buy / Sell + Order type toggles */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div className="type-toggle" style={{ flex: "0 0 auto", width: "140px" }}>
            <button
              className={`type-btn ${orderType === "buy" ? "active" : ""}`}
              onClick={() => { setOrderType("buy"); setMsg({ type: "", text: "" }); }}
            >
              Buy
            </button>
            <button
              className={`type-btn ${orderType === "sell" ? "sell-active" : ""}`}
              onClick={() => { setOrderType("sell"); setMsg({ type: "", text: "" }); }}
            >
              Sell
            </button>
          </div>
          <div className="type-toggle" style={{ flex: "0 0 auto", width: "220px" }}>
            <button
              className={`type-btn ${priceType === "market" ? (orderType === "buy" ? "active" : "sell-active") : ""}`}
              onClick={() => setPriceType("market")}
            >
              Market
            </button>
            <button
              className={`type-btn ${priceType === "limit" ? (orderType === "buy" ? "active" : "sell-active") : ""}`}
              onClick={() => setPriceType("limit")}
            >
              Limit
            </button>
            <button
              className={`type-btn ${priceType === "sl" ? (orderType === "buy" ? "active" : "sell-active") : ""}`}
              onClick={() => setPriceType("sl")}
            >
              SL
            </button>
          </div>
        </div>

        {/* Stock symbol input */}
        <div className="form-row">
          <span className="form-label">Stock</span>
          <input
            className="form-input"
            value={stock}
            placeholder="e.g. INFY, RELIANCE"
            onChange={(e) => setStock(e.target.value.toUpperCase())}
          />
        </div>

        {/* Qty + Price row */}
        <div className="form-row" style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "8px" }}>
            <span className="form-label" style={{ width: "auto" }}>Qty</span>
            <input
              className="form-input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "8px" }}>
            <span className="form-label" style={{ width: "auto" }}>@ ₹</span>
            <input
              className="form-input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={priceType === "market"}
              placeholder={priceType === "market" ? "Market price" : "Enter price"}
            />
          </div>
        </div>

        {/* Margin summary row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            marginTop: "4px",
            marginBottom: "12px",
          }}
        >
          <span>Total {orderType === "buy" ? "cost" : "value"}</span>
          <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>
            ₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="action-row">
          <button
            className={`confirm-btn confirm-${orderType}`}
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : `${orderType === "buy" ? "Buy" : "Sell"} ${stock || "Stock"}`}
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {/* Order book */}
      <div className="section-title">Order book today</div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No orders placed today</div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-secondary)",
              marginTop: "4px",
              fontStyle: "italic",
            }}
          >
            Orders placed above will appear here
          </div>
        </div>
      ) : (
        <table className="mini-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              // Backend may return .name (old seed data) or .stock (new orders)
              const symbol = order.stock || order.name || "—";
              const mode   = order.type?.toUpperCase() || order.mode || "BUY";
              const total  = (parseFloat(order.qty || 0) * parseFloat(order.price || 0));
              return (
                <tr key={order._id || index}>
                  <td style={{ textAlign: "left" }}>{symbol}</td>
                  <td>
                    <span
                      className={`badge-pill ${mode === "BUY" ? "badge-buy" : "badge-sell"}`}
                    >
                      {mode}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{parseFloat(order.price || 0).toFixed(2)}</td>
                  <td>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: "var(--color-text-success)", fontWeight: 500 }}>
                    {order.status?.toUpperCase() || "COMPLETE"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Orders;
