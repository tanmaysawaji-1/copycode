const express = require("express");
const router  = express.Router();
const { PositionsModel } = require("../models/PositionsModel");
const ALL_STOCKS         = require("../data/stocks");

// ── GET /allPositions ─────────────────────────────────────────
// Returns open intraday positions with refreshed live price.
// Positions are created automatically by orders.js on every trade.
//
router.get("/allPositions", async (req, res) => {
  try {
    const positions = await PositionsModel.find({});

    const enriched = positions.map((p) => {
      const stockInfo = ALL_STOCKS.find((s) => s.name === p.name);
      const livePrice = stockInfo?.price ?? p.price ?? p.avg;

      const dayPct =
        p.avg > 0
          ? (((livePrice - p.avg) / p.avg) * 100).toFixed(2)
          : "0.00";

      return {
        _id:     p._id,
        name:    p.name,
        qty:     p.qty,
        avg:     p.avg,
        price:   livePrice,
        product: p.product || "MIS",
        day:     `${dayPct >= 0 ? "+" : ""}${dayPct}%`,
        isLoss:  livePrice < p.avg,
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

module.exports = router;