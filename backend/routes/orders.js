const express = require("express");
const router  = express.Router();
const { OrdersModel }   = require("../models/OrdersModel");
const { Holdingmodel }  = require("../models/Holdingmodel");
const { PositionsModel } = require("../models/PositionsModel");
const { Funds, Transaction } = require("../models/Funds");
const ALL_STOCKS = require("../data/stocks");

const USER_ID = "user123"; // replace with req.user.id once JWT auth is wired

// ── GET /orders ──────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const orders = await OrdersModel.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ── POST /orders ─────────────────────────────────────────────
router.post("/orders", async (req, res) => {
  try {
    const { stock, qty, price, type, orderType } = req.body;
    const userId = USER_ID;

    // ── Validate input ───────────────────────────────────────
    if (!stock || !stock.trim())
      return res.status(400).json({ error: "Stock symbol is required" });
    if (!qty || Number(qty) < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });
    if (!type || !["buy","sell","BUY","SELL"].includes(type))
      return res.status(400).json({ error: "Order type must be BUY or SELL" });

    const isBuy = type.toUpperCase() === "BUY";
    const symbol = stock.toUpperCase().trim();
    const numQty = Number(qty);

    // ── Resolve execution price ──────────────────────────────
    // Market order → use price from ALL_STOCKS; Limit order → use provided price
    const stockInfo = ALL_STOCKS.find(s => s.name === symbol);
    const executionPrice = (orderType === "market" || !price || Number(price) === 0)
      ? (stockInfo?.price || 0)
      : Number(price);

    if (executionPrice <= 0)
      return res.status(400).json({ error: `Could not resolve price for ${symbol}` });

    const totalAmount = parseFloat((executionPrice * numQty).toFixed(2));

    // ── 1. Funds check & update ──────────────────────────────
    let userFunds = await Funds.findOne({ userId });
    if (!userFunds) {
      // Auto-create funds account if missing
      userFunds = await Funds.create({
        userId,
        availableCash: 0,
        availableMargin: 0,
        openingBalance: 0,
      });
    }

    if (isBuy && userFunds.availableCash < totalAmount) {
      return res.status(400).json({
        error: `Insufficient funds. Required ₹${totalAmount.toLocaleString()}, available ₹${userFunds.availableCash.toLocaleString()}`,
      });
    }

    // Deduct on BUY, credit on SELL
    await Funds.findOneAndUpdate(
      { userId },
      { $inc: { availableCash: isBuy ? -totalAmount : totalAmount } },
      { new: true }
    );

    // ── 2. Update Holdings ───────────────────────────────────
    if (isBuy) {
      const existing = await Holdingmodel.findOne({ name: symbol });
      if (existing) {
        const newQty = existing.qty + numQty;
        const newAvg = parseFloat(
          ((existing.avg * existing.qty + totalAmount) / newQty).toFixed(2)
        );
        await Holdingmodel.updateOne(
          { name: symbol },
          { qty: newQty, avg: newAvg, price: executionPrice }
        );
      } else {
        await Holdingmodel.create({
          name:  symbol,
          qty:   numQty,
          avg:   executionPrice,
          price: executionPrice,
          net:   "0.00%",
          day:   "0.00%",
        });
      }
    } else {
      // SELL — validate holding exists and has enough qty
      const existing = await Holdingmodel.findOne({ name: symbol });
      if (!existing || existing.qty < numQty) {
        return res.status(400).json({
          error: `Not enough holdings. You have ${existing?.qty || 0} share(s) of ${symbol}`,
        });
      }
      if (existing.qty === numQty) {
        await Holdingmodel.deleteOne({ name: symbol });
      } else {
        await Holdingmodel.updateOne({ name: symbol }, { $inc: { qty: -numQty } });
      }
    }

    // ── 3. Update / create Position (intraday log) ────────────
    // Check if a position already exists for this stock today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingPosition = await PositionsModel.findOne({
      name:      symbol,
      createdAt: { $gte: today },
    });

    if (existingPosition) {
      // Update net qty and recalculate avg for intraday netting
      const netQty = isBuy
        ? existingPosition.qty + numQty
        : existingPosition.qty - numQty;

      if (netQty <= 0) {
        // Position squared off — remove it
        await PositionsModel.deleteOne({ _id: existingPosition._id });
      } else {
        await PositionsModel.updateOne(
          { _id: existingPosition._id },
          {
            qty:   netQty,
            price: executionPrice,
            day:   `${(((executionPrice - existingPosition.avg) / existingPosition.avg) * 100).toFixed(2)}%`,
          }
        );
      }
    } else {
      // Create a new intraday position
      await PositionsModel.create({
        name:    symbol,
        qty:     numQty,
        avg:     executionPrice,
        price:   executionPrice,
        product: "MIS",          // intraday by default; extend for CNC if needed
        day:     "0.00%",
        isLoss:  false,
      });
    }

    // ── 4. Log Transaction (shows up in Funds history) ────────
    await Transaction.create({
      userId,
      type:   isBuy ? "buy" : "sell",
      amount: totalAmount,
      refId:  `ORD${Date.now()}`,
      status: "completed",
    });

    // ── 5. Save Order record ──────────────────────────────────
    const newOrder = await OrdersModel.create({
      name:  symbol,   // kept for backward compat with old seed data
      stock: symbol,   // added so frontend can read order.stock
      qty:   numQty,
      price: executionPrice,
      mode:  isBuy ? "BUY" : "SELL",
      type:  isBuy ? "buy" : "sell",
      status: "completed",
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;