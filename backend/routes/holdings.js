const express = require("express");
const router  = express.Router();
const { Holdingmodel } = require("../models/Holdingmodel");
const ALL_STOCKS       = require("../data/stocks");

// ── GET /allHoldings ──────────────────────────────────────────
// Returns all holdings with refreshed prices + net/day change
// calculated from the live (or latest static) ALL_STOCKS data.
//
// When you add the Python market service, replace the ALL_STOCKS
// price lookup with:
//   const live = await axios.get(`${PYTHON_URL}/price/${h.name}`);
//   h.price = live.data.price;
//
router.get("/allHoldings", async (req, res) => {
  try {
    let holdings = await Holdingmodel.find({});

    // Refresh price, net%, day% from ALL_STOCKS (or Python service later)
    const enriched = holdings.map((h) => {
      const stockInfo = ALL_STOCKS.find((s) => s.name === h.name);
      const livePrice = stockInfo?.price ?? h.price ?? h.avg;

      // Net change % = ((livePrice - avg) / avg) × 100
      const netPct =
        h.avg > 0
          ? (((livePrice - h.avg) / h.avg) * 100).toFixed(2)
          : "0.00";

      // Day change % — use ALL_STOCKS field if available, else derive from price vs prev close
      // ALL_STOCKS should ideally carry a `prevClose` field; use `percent` as fallback
      const dayPct = stockInfo?.percent ?? `${netPct}%`;

      return {
        _id:    h._id,
        name:   h.name,
        qty:    h.qty,
        avg:    h.avg,
        price:  livePrice,
        net:    `${netPct >= 0 ? "+" : ""}${netPct}%`,
        day:    dayPct,
        isLoss: livePrice < h.avg,
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

module.exports = router;