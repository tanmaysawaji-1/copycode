const express = require("express");
const router = express.Router();
const { Holdingmodel } = require("../models/Holdingmodel");

// GET /allHoldings
router.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await Holdingmodel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

module.exports = router;
