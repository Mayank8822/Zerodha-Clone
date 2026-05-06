const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const authRoute = require("./server/Routes/AuthRoute");

const { HoldingModel } = require("./model/HoldingsModel");
const { PositionModel } = require("./model/PositionsModel");
const { OrderModel } = require("./model/OrdersModel");

const YahooFinance = require("yahoo-finance2").default;

const SYMBOL_MAP = {
  "M&M": "MM.NS",
  "SGBMAY29": "SGBMAY29.BO",
  "NIFTY 50": "^NSEI",
  SENSEX: "^BSESN",
};

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
const yahooFinance = new YahooFinance();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionModel.find({});
  res.json(allPositions);
});

app.post("/newOrders", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const normalizedQty = Number(qty);
    const normalizedPrice = Number(price);

    if (!name || !normalizedQty || normalizedQty <= 0 || normalizedPrice < 0) {
      return res.status(400).send("Invalid order details");
    }

    const newOrder = new OrderModel({
      name,
      qty: normalizedQty,
      price: normalizedPrice,
      mode,
    });

    const holding = await HoldingModel.findOne({ name });

    if (mode === "BUY") {
      if (holding) {
        const totalQuantity = holding.qty + normalizedQty;
        const totalCost = holding.avg * holding.qty + normalizedPrice * normalizedQty;

        holding.qty = totalQuantity;
        holding.avg = totalCost / totalQuantity;
        holding.price = normalizedPrice;
        await holding.save();
      } else {
        await HoldingModel.create({
          name,
          qty: normalizedQty,
          avg: normalizedPrice,
          price: normalizedPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
      }
    } else if (mode === "SELL") {
      if (!holding) {
        return res.status(400).send("Holding not found");
      }

      if (holding.qty < normalizedQty) {
        return res.status(400).send("Sell quantity exceeds holding quantity");
      }

      holding.qty -= normalizedQty;
      holding.price = normalizedPrice;

      if (holding.qty === 0) {
        await HoldingModel.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    } else {
      return res.status(400).send("Invalid order mode");
    }

    await newOrder.save();
    res.send("Order saved successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving order");
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching orders");
  }
});

app.post("/api/prices", async (req, res) => {
  try {
    const { symbols } = req.body;

     if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ error: "symbols must be a non-empty array" });
    }

    const nsSymbols = symbols.map((s) => SYMBOL_MAP[s] || `${s}.NS`);

    const results = await Promise.allSettled(
      nsSymbols.map((sym) =>
        yahooFinance.quote(sym, { fields: ["regularMarketPrice", "regularMarketChangePercent"] })
      )
    );

    const prices = {};
    results.forEach((result, i) => {
      const originalSymbol = symbols[i];
      if (result.status === "fulfilled" && result.value?.regularMarketPrice) {
        const q = result.value;
        const change = q.regularMarketChangePercent || 0;
        prices[originalSymbol] = {
          price: q.regularMarketPrice,
          percent: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
          isDown: change < 0,
        };
      } else {
        prices[originalSymbol] = null;
      }
    });

    res.json(prices);
  } catch (err) {
    console.error("Price fetch error:", err);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

mongoose.connect(uri)
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log("Backend Started at Port", PORT);
    });
  })
  .catch(err => console.log(err));
