import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://hungryhub-backend-bgem.onrender.com";

const TopBar = () => {
  const [indices, setIndices] = useState({ nifty: null, sensex: null });

  useEffect(() => {
    const fetchIndices = () =>
      axios.get(`${API_URL}/indices`)
        .then(r => setIndices(r.data))
        .catch(err => console.error(err));
    
    fetchIndices();
    const interval = setInterval(fetchIndices, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const niftyUp = indices.nifty?.change >= 0;
  const sensexUp = indices.sensex?.change >= 0;

  return (
    <div className="topbar">
      <div className="indices">
        <div className="idx">
          <span className="idx-name">NIFTY 50</span>
          <span className={`idx-val ${niftyUp ? "up" : "red"}`}>
            {indices.nifty?.value ?? "—"}
          </span>
          <span className={`idx-chg ${niftyUp ? "up" : "red"}`}>
            {indices.nifty?.changePercent ? `${indices.nifty.changePercent}%` : ""}
          </span>
        </div>
        <div className="idx">
          <span className="idx-name">SENSEX</span>
          <span className={`idx-val ${sensexUp ? "up" : "red"}`}>
            {indices.sensex?.value ?? "—"}
          </span>
          <span className={`idx-chg ${sensexUp ? "up" : "red"}`}>
            {indices.sensex?.changePercent ? `${indices.sensex.changePercent}%` : ""}
          </span>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default TopBar;