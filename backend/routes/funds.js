const express = require("express");
const router  = express.Router();
const { Funds, Transaction } = require("../models/Funds");

// Simulated middleware to attach userId
router.use((req, res, next) => {
  req.userId = "user123";
  next();
});

router.get("/funds", async (req, res) => {
  try {
    const userId = req.userId;
    let funds = await Funds.findOne({ userId });

    if (!funds) {
      funds = await Funds.create({ userId, availableCash: 4043.10, availableMargin: 4043.10, openingBalance: 4043.10 });
    }

    const transactions = await Transaction
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ funds, transactions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch funds" });
  }
});

router.post("/funds/add", async (req, res) => {
  const { amount, upiId } = req.body;
  const userId = req.userId;

  if (!amount || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });
  if (amount < 100)
    return res.status(400).json({ error: "Minimum transfer is ₹100" });
  if (amount > 200000)
    return res.status(400).json({ error: "Maximum single transfer is ₹2,00,000" });
  if (!upiId || !upiId.includes("@"))
    return res.status(400).json({ error: "Invalid UPI ID" });

  try {
    const funds = await Funds.findOneAndUpdate(
      { userId },
      {
        $inc: {
          availableCash:   amount,
          availableMargin: amount,
          payin:           amount,
        },
      },
      { new: true, upsert: true }
    );

    const transaction = await Transaction.create({
      userId,
      type:   "add",
      amount,
      upiId,
      status: "completed",
    });

    res.json({ funds, transaction });
  } catch (err) {
    res.status(500).json({ error: "Failed to process payment" });
  }
});

router.post("/funds/withdraw", async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  if (!amount || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });
  if (amount < 100)
    return res.status(400).json({ error: "Minimum withdrawal is ₹100" });

  try {
    const existing = await Funds.findOne({ userId });
    if (!existing)
      return res.status(404).json({ error: "No funds account found" });

    if (amount > existing.availableCash)
      return res.status(400).json({ error: "Insufficient funds" });

    const funds = await Funds.findOneAndUpdate(
      { userId },
      {
        $inc: {
          availableCash:   -amount,
          availableMargin: -amount,
        },
      },
      { new: true }
    );

    const transaction = await Transaction.create({
      userId,
      type:   "withdraw",
      amount,
      refId:  `WD${Date.now()}`,
      status: "completed",
    });

    res.json({ funds, transaction });
  } catch (err) {
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
});

module.exports = router;
