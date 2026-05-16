const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId:  { type: String, required: true },
    type:    { type: String, enum: ["add", "withdraw"], required: true },
    amount:  { type: Number, required: true },
    upiId:   { type: String },          // only for "add"
    refId:   { type: String },          // bank ref for "withdraw"
    status:  {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const fundsSchema = new mongoose.Schema({
  userId:           { type: String, required: true, unique: true },
  availableMargin:  { type: Number, default: 0 },
  usedMargin:       { type: Number, default: 0 },
  availableCash:    { type: Number, default: 0 },
  openingBalance:   { type: Number, default: 0 },
  sebiCharges:      { type: Number, default: 0 },
  payin:            { type: Number, default: 0 },
  span:             { type: Number, default: 0 },
  deliveryMargin:   { type: Number, default: 0 },
  exposure:         { type: Number, default: 0 },
  optionsPremium:   { type: Number, default: 0 },
  collateralLiquid: { type: Number, default: 0 },
  collateralEquity: { type: Number, default: 0 },
  totalCollateral:  { type: Number, default: 0 },
});

const Funds       = mongoose.model("Funds",       fundsSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Funds, Transaction };
