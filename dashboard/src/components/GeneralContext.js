import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid) => {},
  closeSellWindow: () => {},
  selectedStockUID: "",
  orderType: "buy" // "buy" or "sell"
});

export const GeneralContextProvider = (props) => {
  const navigate = useNavigate();
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [orderType, setOrderType] = useState("buy");

  const handleOpenBuyWindow = (uid) => {
    setOrderType("buy");
    setSelectedStockUID(uid);
    navigate("/orders");
  };

  const handleCloseBuyWindow = () => {
    setSelectedStockUID("");
  };

  const handleOpenSellWindow = (uid) => {
    setOrderType("sell");
    setSelectedStockUID(uid);
    navigate("/orders");
  };

  const handleCloseSellWindow = () => {
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        selectedStockUID,
        orderType
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;