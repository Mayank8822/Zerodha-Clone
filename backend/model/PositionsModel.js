const mongoose = require("mongoose");

const { PositionsSchema } = require("../schemas/PositionsSchema");

const PositionModel =  mongoose.model("Position" , PositionsSchema); //order pural became name of collection of db.

module.exports = { PositionModel };