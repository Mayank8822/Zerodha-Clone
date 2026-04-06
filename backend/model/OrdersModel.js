const {model, default: mongoose} = require("mongoose");

const {OrdersSchema} = require("../schemas/OrdersSchema"); //

const OrderModel = mongoose.model("Order" , OrdersSchema); //order pural became name of collection of db.

module.exports = {OrderModel};