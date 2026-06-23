import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import Userwatch from "./Userwatch";

// Note: OrderWindow.js is no longer used.
// Orders.js has the order form built-in, so OrderWindow is dead code.
// You can safely delete OrderWindow.js from your project.

const Dashboard = () => {
  return (
    <div className="body">
      <GeneralContextProvider>
        <WatchList />
        <div className="main">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/userwatch" element={<Userwatch/>}/>
          </Routes>
        </div>
      </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;