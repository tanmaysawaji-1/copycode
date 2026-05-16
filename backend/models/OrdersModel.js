const { model } = require("mongoose");

const { OrdersSchema  } = require("../backendschems/OrdersSchema");

const OrdersModel = model("order", OrdersSchema);

module.exports = { OrdersModel };