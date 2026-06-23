
import React, { useState, useMemo } from "react";
import "./userwatch.css";

const raw = [
  { name: "INFY", exchange: "NSE", price: 1555.45, percent: -1.6, low: 1540.0, high: 1580.2, mcap: "6.57T" },
  { name: "ONGC", exchange: "NSE", price: 116.8, percent: -0.09, low: 115.5, high: 118.4, mcap: "1.47T" },
  { name: "TCS", exchange: "NSE", price: 3194.8, percent: -0.25, low: 3170.0, high: 3230.5, mcap: "11.60T" },
  { name: "KPITTECH", exchange: "NSE", price: 266.45, percent: 3.54, low: 255.0, high: 270.1, mcap: "72.4B" },
  { name: "QUICKHEAL", exchange: "NSE", price: 308.55, percent: -0.15, low: 304.0, high: 313.8, mcap: "4.5B" },
  { name: "WIPRO", exchange: "NSE", price: 577.75, percent: 0.32, low: 571.0, high: 582.4, mcap: "3.02T" },
  { name: "M&M", exchange: "NSE", price: 779.8, percent: -0.01, low: 773.5, high: 786.6, mcap: "969B" },
  { name: "RELIANCE", exchange: "NSE", price: 2112.4, percent: 1.44, low: 2086.0, high: 2130.0, mcap: "14.31T" },
  { name: "HUL", exchange: "NSE", price: 512.4, percent: 1.04, low: 506.0, high: 518.9, mcap: "1.20T" },
  { name: "HDFCBANK", exchange: "NSE", price: 1670.45, percent: 0.11, low: 1658.0, high: 1685.3, mcap: "12.70T" },
  { name: "AXISBANK", exchange: "NSE", price: 1089.0, percent: -0.42, low: 1080.0, high: 1096.5, mcap: "3.36T" },
];

const Userwatch = () => {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState(1);

  const pct = (v) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

  const fmt = (v) =>
    v.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const barPct = (price, low, high) => {
    if (high === low) return 50;
    return ((price - low) / (high - low)) * 100;
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => prev * -1);
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const filteredData = useMemo(() => {
    let data = raw.filter((stock) => {
      const matchSearch = stock.name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filterMode === "up") return matchSearch && stock.percent > 0;
      if (filterMode === "dn") return matchSearch && stock.percent < 0;

      return matchSearch;
    });

    data.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];

      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });

    return data;
  }, [search, filterMode, sortKey, sortDir]);

  const gainers = raw.filter((s) => s.percent > 0).length;
  const losers = raw.filter((s) => s.percent < 0).length;
  const avgChange =
    raw.reduce((sum, s) => sum + s.percent, 0) / raw.length;

  const topGainer = [...raw].sort((a, b) => b.percent - a.percent)[0];
  const topLoser = [...raw].sort((a, b) => a.percent - b.percent)[0];

  return (
    <div className="stock-wrap">
      {/* Summary */}
      <div className="summary">
        <div className="metric">
          <div className="metric-label">Stocks</div>
          <div className="metric-val">{raw.length}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Gainers</div>
          <div className="metric-val up">{gainers}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Losers</div>
          <div className="metric-val dn">{losers}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Avg Change</div>
          <div className={`metric-val ${avgChange >= 0 ? "up" : "dn"}`}>
            {pct(avgChange)}
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Top Gainer</div>
          <div className="metric-val up">
            {topGainer.name} ({pct(topGainer.percent)})
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Top Loser</div>
          <div className="metric-val dn">
            {topLoser.name} ({pct(topLoser.percent)})
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className={`filter-btn ${filterMode === "all" ? "active" : ""}`}
          onClick={() => setFilterMode("all")}
        >
          All
        </button>

        <button
          className={`filter-btn ${filterMode === "up" ? "active" : ""}`}
          onClick={() => setFilterMode("up")}
        >
          Gainers
        </button>

        <button
          className={`filter-btn ${filterMode === "dn" ? "active" : ""}`}
          onClick={() => setFilterMode("dn")}
        >
          Losers
        </button>
      </div>

      {/* Table */}
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>Symbol</th>
              <th onClick={() => handleSort("exchange")}>Exchange</th>
              <th onClick={() => handleSort("price")}>Price</th>
              <th onClick={() => handleSort("percent")}>Change</th>
              <th>Day Range</th>
              <th>Market Cap</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No stocks match your filter.
                </td>
              </tr>
            ) : (
              filteredData.map((stock) => {
                const up = stock.percent >= 0;

                return (
                  <tr key={stock.name}>
                    <td>
                      {stock.name}
                      <span className="exch-badge">
                        {stock.exchange}
                      </span>
                    </td>

                    <td>{stock.exchange}</td>

                    <td>₹{fmt(stock.price)}</td>

                    <td>
                      <span className={up ? "up-bg" : "dn-bg"}>
                        {pct(stock.percent)}
                      </span>
                    </td>

                    <td>
                      <div>
                        <small>
                          {fmt(stock.low)} - {fmt(stock.high)}
                        </small>
                      </div>

                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${barPct(
                              stock.price,
                              stock.low,
                              stock.high
                            )}%`,
                            background: up ? "#1D9E75" : "#D85A30",
                          }}
                        />
                      </div>
                    </td>

                    <td>₹{stock.mcap}</td>

                    <td>
                      <button
                        className="action-btn buy-btn"
                        onClick={() =>
                          alert(
                            `Buy ${stock.name} at ₹${stock.price}`
                          )
                        }
                      >
                        Buy
                      </button>

                      <button
                        className="action-btn sell-btn"
                        onClick={() =>
                          alert(
                            `Sell ${stock.name} at ₹${stock.price}`
                          )
                        }
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Userwatch;