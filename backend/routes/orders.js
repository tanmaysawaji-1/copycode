const express = require("express");
const router  = express.Router();
const { OrdersModel } = require("../models/OrdersModel");
const { Holdingmodel } = require("../models/Holdingmodel");
const { Funds } = require("../models/Funds");
const ALL_STOCKS = require("../data/stocks");

// GET /orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await OrdersModel.find({}).sort({ _id: -1 }).limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST /orders
router.post("/orders", async (req, res) => {
  try {
    const { stock, qty, price, type } = req.body;
    const userId = "user123"; // Dummy user for demonstration

    // Get current price if not provided (Market Order)
    const stockInfo = ALL_STOCKS.find(s => s.name === stock);
    const executionPrice = price || (stockInfo ? stockInfo.price : 0);
    const totalAmount = executionPrice * qty;

    const isBuy = type.toUpperCase() === "BUY";

    // 1. Update Funds
    const userFunds = await Funds.findOne({ userId });
    if (isBuy && userFunds && userFunds.availableCash < totalAmount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    await Funds.findOneAndUpdate(
      { userId },
      { $inc: { availableCash: isBuy ? -totalAmount : totalAmount } },
      { upsert: true }
    );

    // 2. Update Holdings
    if (isBuy) {
      const existingHolding = await Holdingmodel.findOne({ name: stock });
      if (existingHolding) {
        const newQty = existingHolding.qty + qty;
        const newAvg = (existingHolding.avg * existingHolding.qty + totalAmount) / newQty;
        await Holdingmodel.updateOne({ name: stock }, { qty: newQty, avg: newAvg });
      } else {
        await Holdingmodel.create({
          name: stock,
          qty: qty,
          avg: executionPrice,
          price: executionPrice,
          net: "0.00%",
          day: "0.00%"
        });
      }
    } else {
      const existingHolding = await Holdingmodel.findOne({ name: stock });
      if (!existingHolding || existingHolding.qty < qty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }
      if (existingHolding.qty === qty) {
        await Holdingmodel.deleteOne({ name: stock });
      } else {
        await Holdingmodel.updateOne({ name: stock }, { $inc: { qty: -qty } });
      }
    }

    // 3. Save Order Record
    let newOrder = new OrdersModel({
      name: stock,
      qty: qty,
      price: executionPrice,
      mode: isBuy ? "BUY" : "SELL",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;
