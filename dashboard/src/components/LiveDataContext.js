import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const LiveDataContext = createContext();

export const useLiveData = () => useContext(LiveDataContext);

export const LiveDataProvider = ({ children }) => {
  const [livePrices, setLivePrices] = useState({});
  const wsRef = useRef(null);
  const subscribedSymbols = useRef(new Set());

  const subscribe = (symbols) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const newSymbols = symbols.filter(s => !subscribedSymbols.current.has(s));
    if (newSymbols.length === 0) return;
    newSymbols.forEach(s => subscribedSymbols.current.add(s));
    wsRef.current.send(JSON.stringify({ type: "subscribe", symbols: newSymbols }));
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Re-subscribe any previously added symbols
      if (subscribedSymbols.current.size > 0) {
        ws.send(JSON.stringify({ type: "subscribe", symbols: Array.from(subscribedSymbols.current) }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // data is like { "RELIANCE.NS": { price, change, change_pct }, ... }
      setLivePrices(prev => ({ ...prev, ...data }));
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  return (
    <LiveDataContext.Provider value={{ livePrices, subscribe }}>
      {children}
    </LiveDataContext.Provider>
  );
};