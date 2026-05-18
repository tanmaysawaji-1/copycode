const express = require("express");
const router  = express.Router();
const { Funds, Transaction } = require("../models/Funds");
const { Holdingmodel }       = require("../models/Holdingmodel");
const ALL_STOCKS             = require("../data/stocks");

const USER_ID = "user123"; // replace with req.user.id once JWT is wired

// ── GET /summary ──────────────────────────────────────────────
// Aggregates real data from Funds + Holdings.
// Previously this returned fully hardcoded numbers — now it reads
// from the database so the dashboard reflects actual activity.
//
router.get("/summary", async (req, res) => {
  try {
    const userId = USER_ID;

    // ── 1. Funds ─────────────────────────────────────────────
    const funds = await Funds.findOne({ userId });
    const availableCash = parseFloat((funds?.availableCash || 0).toFixed(2));

    // ── 2. Holdings with refreshed prices ────────────────────
    const holdings = await Holdingmodel.find({});

    let totalInvested    = 0;
    let totalCurrentVal  = 0;

    const enrichedHoldings = holdings.map((h) => {
      const stockInfo  = ALL_STOCKS.find((s) => s.name === h.name);
      const livePrice  = stockInfo?.price ?? h.price ?? h.avg;
      const curVal     = livePrice * h.qty;
      const invested   = h.avg * h.qty;
      const pnl        = parseFloat((curVal - invested).toFixed(2));

      totalInvested   += invested;
      totalCurrentVal += curVal;

      return {
        name:    h.name,
        price:   livePrice,
        qty:     h.qty,
        avg:     h.avg,
        pnl,
        day:     stockInfo?.percent ?? "0.00%",
        isLoss:  pnl < 0,
      };
    });

    // ── 3. P&L ───────────────────────────────────────────────
    const pnl        = parseFloat((totalCurrentVal - totalInvested).toFixed(2));
    const pnlPercent =
      totalInvested > 0
        ? ((pnl / totalInvested) * 100).toFixed(2)
        : "0.00";

    // Total equity = cash + current value of all holdings
    const totalEquity = parseFloat((availableCash + totalCurrentVal).toFixed(2));

    // ── 4. Top movers — top 5 holdings by absolute P&L ───────
    const topMovers = [...enrichedHoldings]
      .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
      .slice(0, 5)
      .map((h) => ({
        name:   h.name,
        price:  h.price,
        day:    h.day,
        isLoss: h.isLoss,
        pnl:    h.pnl,
      }));

    // ── 5. 7-day trend from Transaction history ───────────────
    // Build a simple running-balance trend from the last 7 days of
    // fund add/withdraw transactions as a proxy for portfolio value.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTxns = await Transaction.find({
      userId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: 1 });

    let runningBalance = availableCash;
    // Walk backwards to estimate starting balance
    recentTxns.slice().reverse().forEach((t) => {
      if (t.type === "add")      runningBalance -= t.amount;
      if (t.type === "withdraw") runningBalance += t.amount;
    });

    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trend = [];
    let bal = runningBalance;

    // Generate one data point per day for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);

      // Sum transactions on this day
      const dayTxns = recentTxns.filter(
        (t) => new Date(t.createdAt) >= d && new Date(t.createdAt) < nextDay
      );

      dayTxns.forEach((t) => {
        if (t.type === "add")      bal += t.amount;
        if (t.type === "withdraw") bal -= t.amount;
        // order buys reduce cash but add equity — net effect ≈ 0 for balance
      });

      trend.push({
        date:  DAYS[d.getDay()],
        value: parseFloat((bal + totalCurrentVal).toFixed(2)),
      });
    }

    res.json({
      availableCash,
      totalEquity,
      totalInvested:  parseFloat(totalInvested.toFixed(2)),
      totalCurrentVal: parseFloat(totalCurrentVal.toFixed(2)),
      pnl,
      pnlPercent,
      topMovers,
      trend,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

module.exports = router;