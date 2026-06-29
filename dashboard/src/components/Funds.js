import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL ="https://hungryhub-e81l.onrender.com";
const UPI_REGEX = /^[\w.\-]+@[\w]+$/;

const Funds = () => {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [showAdd, setShowAdd]         = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount]           = useState("");
  const [upiId, setUpiId]             = useState("user@upi");
  const [msg, setMsg]                 = useState({ type: "", text: "" });
  const [submitting, setSubmitting]   = useState(false);

  const fetchFunds = () => {
    axios.get(`${API_URL}/funds`)
      .then((res) => { setData(res.data); setLoading(false);})
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchFunds(); }, []);

  // --- Frontend validation helpers ---
  const validateAdd = () => {
    const n = Number(amount);
    if (!n || n < 100)
      return "Minimum deposit amount is ₹100.";
    if (!UPI_REGEX.test(upiId))
      return "Please enter a valid UPI ID (e.g. name@upi).";
    return null;
  };

  const validateWithdraw = () => {
    const n = Number(amount);
    if (!n || n < 100)
      return "Minimum withdrawal amount is ₹100.";
    if (n > (funds.availableCash || 0))
      return `Insufficient balance. Available: ₹${funds.availableCash?.toLocaleString()}`;
    return null;
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const err = validateAdd();
    if (err) { setMsg({ type: "error", text: err }); return; }

    setSubmitting(true);
    setMsg({ type: "", text: "" });
    try {
      await axios.post(`${API_URL}/funds/add`, { amount: Number(amount), upiId });
      setMsg({ type: "success", text: `Successfully added ₹${Number(amount).toLocaleString()} to your account!` });
      setTimeout(() => {
        setShowAdd(false);
        setAmount("");
        fetchFunds();
      }, 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Payment failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const err = validateWithdraw();
    if (err) { setMsg({ type: "error", text: err }); return; }

    setSubmitting(true);
    setMsg({ type: "", text: "" });
    try {
      await axios.post(`${API_URL}/funds/withdraw`, { amount: Number(amount) });
      setMsg({ type: "success", text: `Withdrawal of ₹${Number(amount).toLocaleString()} is being processed!` });
      setTimeout(() => {
        setShowWithdraw(false);
        setAmount("");
        fetchFunds();
      }, 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Withdrawal failed." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="empty-state">Loading funds...</div>;

  const funds = data?.funds || {
    availableMargin: 0,
    availableCash: 0,
    openingBalance: 0,
    usedMargin: 0,
    payin: 0,
  };

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
        <div style={{ fontSize: "14px", fontWeight: 500 }}>Funds</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => { setShowAdd(true); setMsg({ type: "", text: "" }); setAmount(""); }}
            style={{
              fontSize: "11px", padding: "6px 12px", borderRadius: "4px",
              background: "var(--color-text-success)", color: "#fff",
              border: "none", cursor: "pointer", fontWeight: 500,
            }}
          >
            + Add funds
          </button>
          <button
            onClick={() => { setShowWithdraw(true); setMsg({ type: "", text: "" }); setAmount(""); }}
            style={{
              fontSize: "11px", padding: "6px 12px", borderRadius: "4px",
              background: "var(--color-text-info)", color: "#fff",
              border: "none", cursor: "pointer", fontWeight: 500,
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="funds-grid">
        <div>
          <div className="section-title">Equity</div>
          <div className="funds-card">
            <div className="funds-row">
              <span className="funds-key">Available margin</span>
              <span className="funds-val blue">
                ₹{(funds.availableMargin || funds.availableCash || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="funds-row">
              <span className="funds-key">Used margin</span>
              {/* Now bound from API — no longer hardcoded */}
              <span className="funds-val">
                ₹{(funds.usedMargin || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="funds-row">
              <span className="funds-key">Available cash</span>
              <span className="funds-val">
                ₹{(funds.availableCash || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="funds-row">
              <span className="funds-key">Opening balance</span>
              <span className="funds-val">
                ₹{(funds.openingBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="section-title">Commodity</div>
          <div
            className="funds-card"
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: "135px", gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "12px", color: "var(--color-text-secondary)", textAlign: "center",
              }}
            >
              You don't have a commodity account
            </div>
            <button
              style={{
                fontSize: "11px", color: "var(--color-text-info)", padding: "6px 12px",
                border: "1px solid var(--color-border-info)",
                borderRadius: "var(--border-radius-md)", background: "transparent", cursor: "pointer",
              }}
            >
              Open Account ↗
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {data?.transactions?.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <div className="section-title">Recent Transactions</div>
          <table className="mini-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t, i) => (
                <tr key={i}>
                  <td style={{ textAlign: "left" }}>
                    {t.type === "add" ? "Fund Pay-in" : "Withdrawal"}
                  </td>
                  <td>₹{(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: "var(--color-text-success)", fontWeight: 500 }}>
                    {t.status?.toUpperCase()}
                  </td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Funds Modal */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-title">Deposit Funds</div>
            {msg.text && (
              <div className={`modal-alert ${msg.type}`}>{msg.text}</div>
            )}
            <form onSubmit={handleAddFunds}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  className="form-label"
                  style={{ display: "block", marginBottom: "6px" }}
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  autoFocus
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min ₹100"
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  className="form-label"
                  style={{ display: "block", marginBottom: "6px" }}
                >
                  UPI ID
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                />
                <div style={{ fontSize: "10px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  Format: yourname@bankname
                </div>
              </div>
              <button type="submit" className="btn-full confirm-buy" disabled={submitting}>
                {submitting ? "Processing..." : "Add Funds"}
              </button>
              <button
                type="button"
                className="btn-full btn-cancel"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdraw && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-title">Withdraw Funds</div>
            {msg.text && (
              <div className={`modal-alert ${msg.type}`}>{msg.text}</div>
            )}
            <form onSubmit={handleWithdraw}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  className="form-label"
                  style={{ display: "block", marginBottom: "6px" }}
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  className="form-input"
                  autoFocus
                  required
                  min="100"
                  max={funds.availableCash || 0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min ₹100"
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-secondary)",
                    marginTop: "6px",
                  }}
                >
                  Available to withdraw:{" "}
                  <strong>
                    ₹{(funds.availableCash || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
              <button
                type="submit"
                className="btn-full confirm-sell"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Request Withdrawal"}
              </button>
              <button
                type="button"
                className="btn-full btn-cancel"
                onClick={() => setShowWithdraw(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;