const express = require("express");
const router  = express.Router();
const WatchlistModel = require("../models/Watchlist");
const ALL_STOCKS = require("../data/stocks");

router.use((req, res, next) => {
  req.userId = "user123";
  next();
});

router.get("/stocks/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = ALL_STOCKS
    .filter((s) => s.name.toLowerCase().includes(q))
    .slice(0, 10);
  res.json(results);
});

router.get("/watchlist", async (req, res) => {
  try {
    const items = await WatchlistModel.find({ userId: req.userId });
    
    // merge with prices
    const fullItems = items.map(item => {
      const stockInfo = ALL_STOCKS.find(s => s.name === item.name) || { price: 0, percent: "0%" };
      return {
        name: item.name,
        price: stockInfo.price,
        percent: stockInfo.percent || "0.00%",
        isDown: false
      };
    });
    
    res.json(fullItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

router.post("/watchlist", async (req, res) => {
  try {
    const { name } = req.body;
    const count = await WatchlistModel.countDocuments({ userId: req.userId });
    if (count >= 50) return res.status(400).json({ error: "Watchlist full (50 max)" });

    const item = await WatchlistModel.create({ userId: req.userId, name });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add stock" });
  }
});

router.delete("/watchlist/:name", async (req, res) => {
  try {
    await WatchlistModel.deleteOne({ userId: req.userId, name: req.params.name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove stock" });
  }
});

module.exports = router;
