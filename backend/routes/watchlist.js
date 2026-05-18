const express = require("express");
const router  = express.Router();
const WatchlistModel = require("../models/Watchlist");
const ALL_STOCKS     = require("../data/stocks");

const USER_ID = "user123"; // replace with req.user.id once JWT is wired

router.use((req, res, next) => {
  req.userId = USER_ID;
  next();
});

// ── GET /stocks/search ────────────────────────────────────────
router.get("/stocks/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json([]);

  const results = ALL_STOCKS
    .filter((s) => s.name.toLowerCase().includes(q))
    .slice(0, 10)
    .map((s) => ({
      name:     s.name,
      price:    s.price,
      percent:  s.percent || "0.00%",
      exchange: s.exchange || "NSE",
      isDown:   (s.percent || "").startsWith("-"),
    }));

  res.json(results);
});

// ── GET /watchlist ────────────────────────────────────────────
router.get("/watchlist", async (req, res) => {
  try {
    const items = await WatchlistModel.find({ userId: req.userId });

    const fullItems = items.map((item) => {
      const stockInfo = ALL_STOCKS.find((s) => s.name === item.name);
      const price     = stockInfo?.price   ?? 0;
      const percent   = stockInfo?.percent ?? "0.00%";
      // isDown = true when percent string starts with "-"
      const isDown    = percent.trim().startsWith("-");

      return {
        name:    item.name,
        price,
        percent,
        isDown,
        exchange: stockInfo?.exchange || "NSE",
      };
    });

    res.json(fullItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// ── POST /watchlist ───────────────────────────────────────────
router.post("/watchlist", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: "Stock name is required" });

    const count = await WatchlistModel.countDocuments({ userId: req.userId });
    if (count >= 50)
      return res.status(400).json({ error: "Watchlist full (50 max)" });

    // Prevent duplicates
    const existing = await WatchlistModel.findOne({ userId: req.userId, name: name.toUpperCase() });
    if (existing)
      return res.status(400).json({ error: `${name} is already in your watchlist` });

    const item = await WatchlistModel.create({ userId: req.userId, name: name.toUpperCase() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add stock" });
  }
});

// ── DELETE /watchlist/:name ───────────────────────────────────
router.delete("/watchlist/:name", async (req, res) => {
  try {
    await WatchlistModel.deleteOne({ userId: req.userId, name: req.params.name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove stock" });
  }
});

module.exports = router;