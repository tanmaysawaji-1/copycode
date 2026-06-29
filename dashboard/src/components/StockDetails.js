import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PYTHON_URL = "http://localhost:8000";  // Your Python live service
const API_URL =  "https://hungryhub-e81l.onrender.com";

const StockDetails = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addMsg, setAddMsg] = useState("");

  const handleAddToWatchlist = async () => {
    if (!stockData) return;
    try {
      await axios.post(`${API_URL}/watchlist`, { name: stockData.symbol }, { withCredentials: true });
      setAddMsg("Successfully added to Watchlist!");
      setTimeout(() => setAddMsg(""), 3000);
    } catch (err) {
      setAddMsg(err.response?.data?.error || "Failed to add to watchlist");
      setTimeout(() => setAddMsg(""), 3000);
    }
  };

  const performSearch = async (symbol) => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError("");
    setStockData(null);
    try {
      let sym = symbol.toUpperCase();
      if (!sym.endsWith(".NS") && !sym.includes(".")) sym = `${sym}.NS`;
      const response = await axios.get(`${PYTHON_URL}/stock/${sym}`);
      setStockData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Stock not found. Please check the symbol.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when ?symbol= is present in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const symbol = params.get("symbol");
    if (symbol) {
      setSearchTerm(symbol);
      performSearch(symbol);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const formatNumber = (num) => {
    if (num === 0 || num === "N/A") return "N/A";
    if (typeof num === "number") {
      if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)}Cr`;
      if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)}L`;
      return `₹${num.toLocaleString()}`;
    }
    return num;
  };

  const formatYield = (yieldVal) => {
    if (yieldVal === 0 || yieldVal === "N/A") return "N/A";
    return `${yieldVal.toFixed(2)}%`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Stock Research</h2>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="e.g. RELIANCE, TCS, INFY, HDFCBANK"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid var(--color-border-secondary)",
              background: "var(--color-background-primary)",
              color: "var(--color-text-primary)"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "var(--color-text-info)",
              border: "none",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ color: "var(--color-text-danger)", marginBottom: "20px", padding: "10px", background: "rgba(255,0,0,0.1)", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      {stockData && (
        <div className="stock-details-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--color-border-secondary)", paddingBottom: "10px" }}>
            <div>
              <h1 style={{ margin: 0 }}>{stockData.longName} ({stockData.symbol})</h1>
              <div style={{ color: "var(--color-text-secondary)", marginTop: "5px" }}>
                {stockData.sector} | {stockData.industry}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <button 
                className="wl-btn btn-outline" 
                style={{ padding: "8px 16px", fontSize: "14px", fontWeight: "bold" }}
                onClick={handleAddToWatchlist}
              >
                + Add to Watchlist
              </button>
              {addMsg && (
                <div style={{ marginTop: "5px", fontSize: "12px", color: addMsg.includes("Success") ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
                  {addMsg}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {/* Left column - Key metrics */}
            <div>
              <h3>Key Metrics</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Market Cap</td><td style={{ fontWeight: "bold" }}>{formatNumber(stockData.marketCap)}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>P/E Ratio (TTM)</td><td>{stockData.peRatio !== "N/A" ? stockData.peRatio.toFixed(2) : "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Forward P/E</td><td>{stockData.forwardPE !== "N/A" ? stockData.forwardPE.toFixed(2) : "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Dividend Yield</td><td>{formatYield(stockData.dividendYield)}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>EPS (TTM)</td><td>{stockData.eps !== "N/A" ? `₹${stockData.eps.toFixed(2)}` : "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Book Value</td><td>{stockData.bookValue !== "N/A" ? `₹${stockData.bookValue.toFixed(2)}` : "N/A"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Right column - Price range & volume */}
            <div>
              <h3>Price & Volume</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>52-Week High</td><td>{formatNumber(stockData.fiftyTwoWeekHigh)}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>52-Week Low</td><td>{formatNumber(stockData.fiftyTwoWeekLow)}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Avg. Volume</td><td>{stockData.averageVolume?.toLocaleString() || "N/A"}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Exchange</td><td>{stockData.exchange}</td></tr>
                  <tr><td style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border-secondary)" }}>Market</td><td>{stockData.market}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Description section */}
          <div style={{ marginTop: "30px" }}>
            <h3>About</h3>
            <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
              {stockData.description}
              {stockData.website && (
                <span><br /><br />🌐 <a href={stockData.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-info)" }}>Visit website</a></span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;