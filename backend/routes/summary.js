const express = require("express");
const router  = express.Router();

router.get("/summary", (req, res) => {
  // Generate dummy summary data as requested
  const summary = {
    totalEquity: 31430.50,
    availableCash: 4043.10,
    usedMargin: 0.00,
    openingBalance: 4043.10,
    pnl: 1550.20,
    trend: [
      { date: "M", value: 30000 },
      { date: "T", value: 30500 },
      { date: "W", value: 29800 },
      { date: "Th", value: 31200 },
      { date: "F", value: 31430.50 }
    ]
  };
  res.json(summary);
});

module.exports = router;
