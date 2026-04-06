const mongoose = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingsSchema"); //

const HoldingModel = mongoose.model("Holding" , HoldingsSchema); //holding pural became name of collection of db.

module.exports = { HoldingModel };