const express = require("express");
const router = express.Router();
const { PositionsModel } = require("../models/PositionsModel");

// GET /allPositions
router.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

module.exports = router;
