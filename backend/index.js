const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const authRoute = require("./server/Routes/AuthRoute");//


const { HoldingModel } = require("./model/HoldingsModel");
const { PositionModel } = require("./model/PositionsModel");
const { OrderModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // frontend and dashboard
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
   
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());//json bcz we working with json data

app.use("/auth" , authRoute);

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });


// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/",(req,res) =>{
  res.send("Backend working");
});

app.get("/allHoldings", async(req,res) =>{
    let allHoldings = await HoldingModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionModel.find({});
  res.json(allPositions);
});

// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });


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


mongoose.connect(uri)
.then(() => {
  console.log("DB Connected");

  app.listen(PORT, () => {
    console.log("Backend Started at Port", PORT);
  });
})
.catch(err => console.log(err));
