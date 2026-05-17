import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},
  selectedStockUID: "",
  selectedStockPrice: 0,
  orderType: "buy",
});

export const GeneralContextProvider = (props) => {
  const navigate = useNavigate();
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [orderType, setOrderType] = useState("buy");

  const handleOpenBuyWindow = (uid, price = 0) => {
    setOrderType("buy");
    setSelectedStockUID(uid);
    setSelectedStockPrice(Number(price) || 0);
    navigate("/orders");
  };

  const handleCloseBuyWindow = () => {
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  const handleOpenSellWindow = (uid, price = 0) => {
    setOrderType("sell");
    setSelectedStockUID(uid);
    setSelectedStockPrice(Number(price) || 0);
    navigate("/orders");
  };

  const handleCloseSellWindow = () => {
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        selectedStockUID,
        selectedStockPrice,
        orderType,
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
