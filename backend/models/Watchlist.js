const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, default: "default-user" }, // Simplification for demo
  name: { type: String, required: true },
});

module.exports = mongoose.model("Watchlist", watchlistSchema);
