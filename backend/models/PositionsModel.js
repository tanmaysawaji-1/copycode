const { model } = require("mongoose");

const { PositionsSchema } = require("../backendschems/PositionsSchema");

const PositionsModel = model("position", PositionsSchema);

module.exports = { PositionsModel };