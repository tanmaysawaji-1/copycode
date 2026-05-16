
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const cookieParser = require("cookie-parser");

const { Holdingmodel } = require("./models/Holdingmodel");

const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const PORT = process.env.PORT || 3003;
const MONGOURL = process.env.MONGOURL;

if (!MONGOURL) {
  console.error("CRITICAL ERROR: MONGOURL is not defined in environment variables.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);


// Simulated WebSocket ticker (Removed)

// Import new routes
const fundsRoutes = require("./routes/funds");
const watchlistRoutes = require("./routes/watchlist");
const summaryRoutes = require("./routes/summary");
const indicesRoutes = require("./routes/indices");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const holdingsRoutes = require("./routes/holdings");
const positionsRoutes = require("./routes/positions");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3001";

app.use(
  cors({
    origin: [FRONTEND_URL, DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Mount the routes
app.use("/", fundsRoutes);
app.use("/", watchlistRoutes);
app.use("/", summaryRoutes);
app.use("/", indicesRoutes);
app.use("/", ordersRoutes);
app.use("/", holdingsRoutes);
app.use("/", positionsRoutes);
app.use("/", authRoutes);

// Modular routes are used instead of inline definitions.


mongoose.connect(MONGOURL)
.then(async ()=>{
  console.log("Connected to MongoDB");
  
  // Auto-seed if empty (Requirement: "Working dashboard with dummy data")
  const holdingCount = await Holdingmodel.countDocuments();
  if (holdingCount === 0) {
    const tempHoldings = [
      { name: "INFY", qty: 5, avg: 1420.0, price: 1542.30, net: "+8.6%", day: "+2.1%" },
      { name: "TCS", qty: 2, avg: 3900.0, price: 3821.0, net: "-2.0%", day: "-0.8%" },
      { name: "HDFCBANK", qty: 8, avg: 1600.0, price: 1670.45, net: "+4.4%", day: "+1.3%" },
      { name: "RELIANCE", qty: 3, avg: 2450.0, price: 2510.00, net: "+2.4%", day: "+0.9%" },
    ];
    await Holdingmodel.insertMany(tempHoldings);
    console.log("Seeding: 4 Dummy Holdings added.");
  }

  const posCount = await PositionsModel.countDocuments();
  if (posCount === 0) {
    const tempPositions = [
      { product: "MIS", name: "NIFTY FUT", qty: 1, avg: 22100, price: 22148, net: "+0.2%", day: "+2,400" },
      { product: "CNC", name: "INFY", qty: 5, avg: 1420, price: 1542, net: "+8.6%", day: "+611" },
    ];
    await PositionsModel.insertMany(tempPositions);
    console.log("Seeding: 2 Dummy Positions added.");
  }

  const WatchlistModel = require("./models/Watchlist");
  const wlCount = await WatchlistModel.countDocuments();
  if (wlCount === 0) {
    const defaultWL = [
      { userId: "user123", name: "INFY" },
      { userId: "user123", name: "TCS" },
      { userId: "user123", name: "RELIANCE" },
      { userId: "user123", name: "HDFCBANK" },
      { userId: "user123", name: "WIPRO" },
    ];
    await WatchlistModel.insertMany(defaultWL);
    console.log("Seeding: Default watchlist added.");
  }

  server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
  })
})
.catch((err)=>{
  console.log("Error connecting to MongoDB:", err);
});
