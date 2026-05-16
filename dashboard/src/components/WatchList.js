import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const WatchList = () => {
  const [watchlist, setWatchlist]       = useState([]);
  const [query, setQuery]               = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]   = useState(false);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/watchlist`)
      .then((res) => setWatchlist(res.data))
      .catch((err) => console.error("Failed to load watchlist:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(() => {
      axios.get(`${API_URL}/stocks/search?q=${query}`)
        .then((res) => {
          const existing = new Set(watchlist.map((s) => s.name));
          setSearchResults(res.data.filter((s) => !existing.has(s.name)));
        })
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, watchlist]);


  // Real-time updates removed (Socket.io removed)

  const handleAdd = async (stock) => {
    try {
      await axios.post(`${API_URL}/watchlist`, { name: stock.name });
      setWatchlist((prev) => [...prev, stock]);
      setQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to add stock:", err);
    }
  };

  const handleRemove = async (stockName) => {
    try {
      await axios.delete(`${API_URL}/watchlist/${stockName}`);
      setWatchlist((prev) => prev.filter((s) => s.name !== stockName));
    } catch (err) {
      console.error("Failed to remove stock:", err);
    }
  };

  const filteredWatchlist = watchlist.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="sidebar" style={{ position: "relative" }}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty fut weekly"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>

      {query && (
        <div className="search-results-dropdown">
          {isSearching && <div className="search-result-item muted">Searching...</div>}
          {!isSearching && searchResults.length === 0 && query && (
            <div className="search-result-item muted">No results for "{query}"</div>
          )}
          {searchResults.map((stock) => (
            <div key={stock.name} className="search-result-item" onClick={() => handleAdd(stock)}>
              <div>
                <span className="wl-name">{stock.name}</span>
                <span style={{ fontSize: "10px", marginLeft: "6px", color: "var(--color-text-secondary)" }}>{stock.exchange}</span>
              </div>
              <button
                className="wl-btn btn-outline"
                disabled={watchlist.length >= 50}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading watchlist...</div>
      ) : (
        <div className="wl-list">
          {filteredWatchlist.length > 0 ? (
            filteredWatchlist.map((stock) => (
              <WatchListItem
                stock={stock}
                key={stock.name}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-text">{query ? `No results for "${query}"` : "Your watchlist is empty"}</div>
            </div>
          )}
        </div>
      )}
      
      <div className="wl-footer">
        <button className="wl-foot-btn">+ Add stock</button>
      </div>
    </div>
  );
};

const WatchListItem = ({ stock, onRemove }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  return (
    <div className="wl-item">
      <span className={`wl-name ${stock.isDown ? "red" : "green"}`}>{stock.name}</span>
      <div className="wl-right">
        <div className="wl-price">{stock.price}</div>
        <div className={`wl-chg ${stock.isDown ? "red" : "green"}`}>{stock.percent}</div>
      </div>
      <div className="wl-actions">
        <button className="wl-btn buy-btn" onClick={(e) => { e.stopPropagation(); openBuyWindow(stock.name); }}>B</button>
        <button className="wl-btn sell-btn" onClick={(e) => { e.stopPropagation(); openSellWindow(stock.name); }}>S</button>
        <button className="wl-btn btn-outline" style={{ marginLeft: "4px" }} onClick={(e) => { e.stopPropagation(); onRemove(stock.name); }}>🗑</button>
      </div>
    </div>
  );
};

export default WatchList;