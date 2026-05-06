# 📈 Stock Trading App — Zerodha Clone

A full-stack stock trading web application inspired by Zerodha, built with the MERN stack. Features user authentication, a live watchlist, portfolio holdings, positions tracking, and real-time NSE stock prices powered by Yahoo Finance.

## ✨ Features

- 🔐 **User Authentication** — Signup/Login with JWT cookies and bcrypt password hashing
- 📊 **Live Stock Prices** — Real-time NSE prices fetched from Yahoo Finance, auto-refreshed every 30 seconds
- 👀 **Watchlist** — Track your favourite stocks with live price and % change
- 💼 **Holdings** — View your portfolio with avg cost, LTP, current value, and P&L
- 📋 **Positions** — Track open CNC/MIS positions with live day change
- 🛒 **Buy / Sell Orders** — Place buy/sell orders that update your holdings in real time
- 📜 **Order History** — View all past orders
- 📉 **Charts** — Doughnut chart for watchlist, bar chart for holdings P&L

---

## 🏗️ Architecture

The app is split into **3 separate services**:

```
Stock Trading App/
├── backend/      → Express + MongoDB REST API        (port 3002)
├── frontend/     → Public landing site + Auth pages  (port 3000)
└── dashboard/    → Trading dashboard (post-login)    (port 3001)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Axios, Bootstrap, React Toastify |
| Dashboard | React, React Context, Chart.js, Material UI |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs, cookie-parser |
| Market Data | yahoo-finance2 (NSE live prices) |
| Dev Tools | Nodemon, dotenv |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/stock-trading-app.git
cd stock-trading-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URL=mongodb://localhost:27017/stocktrading
TOKEN_KEY=your_secret_jwt_key
PORT=3002
```

Start the backend:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

### 4. Setup Dashboard

```bash
cd dashboard
npm install
npm start
```

Runs on `http://localhost:3001`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive JWT cookie |
| POST | `/auth/` | Verify JWT token |

### Trading
| Method | Endpoint | Description |
|---|---|---|
| GET | `/allHoldings` | Get all holdings |
| GET | `/allPositions` | Get all positions |
| GET | `/allOrders` | Get all past orders |
| POST | `/newOrders` | Place a BUY or SELL order |
| POST | `/api/prices` | Get live NSE prices for given symbols |

### `/api/prices` Example

**Request:**
```json
POST /api/prices
{ "symbols": ["RELIANCE", "TCS", "INFY"] }
```

**Response:**
```json
{
  "RELIANCE": { "price": 2945.50, "percent": "+1.24%", "isDown": false },
  "TCS":      { "price": 3310.00, "percent": "-0.45%", "isDown": true },
  "INFY":     { "price": 1480.20, "percent": "+0.80%", "isDown": false }
}
```

---

## 📁 Project Structure

```
backend/
├── index.js                        # Express app entry point
├── model/
│   ├── HoldingsModel.js
│   ├── OrdersModel.js
│   └── PositionsModel.js
├── schemas/
│   ├── HoldingsSchema.js
│   ├── OrdersSchema.js
│   └── PositionsSchema.js
└── server/
    ├── Controllers/AuthController.js
    ├── Middlewares/AuthMiddleware.js
    ├── Models/UserModel.js
    ├── Routes/AuthRoute.js
    └── util/SecretToken.js

frontend/src/
├── landing_page/
│   ├── Authentication/
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── home/HomePage.js
│   └── Navbar.js

dashboard/src/
├── components/
│   ├── GeneralContext.js       # React Context for buy/sell modal
│   ├── WatchList.js            # Live watchlist with 30s refresh
│   ├── Holdings.js             # Portfolio holdings with live LTP
│   ├── Positions.js            # Open positions with live LTP
│   ├── Orders.js               # Order history
│   ├── BuyActionWindow.js      # Buy order modal
│   └── SellActionWindow.js     # Sell order modal
└── data/data.js                # Static watchlist symbols
```

---

## ⚙️ How Live Prices Work

1. Dashboard sends a list of stock symbols to `POST /api/prices`
2. Backend maps symbols to Yahoo Finance format (e.g. `RELIANCE` → `RELIANCE.NS`)
3. `yahoo-finance2` fetches live NSE prices in parallel using `Promise.allSettled`
4. If a symbol fails, it falls back to the last known DB price — no crash
5. Dashboard polls every **30 seconds** automatically via `setInterval`

**Special symbol mappings handled:**
| App Symbol | Yahoo Finance Symbol |
|---|---|
| `M&M` | `MM.NS` |
| `SGBMAY29` | `SGBMAY29.BO` |

---

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret_key
PORT=3002
```

> ⚠️ Never commit your `.env` file. Make sure it's in `.gitignore`.

---

## 🐛 Known Limitations

- Watchlist symbols are currently static (defined in `data.js`) — users cannot add/remove stocks yet
- Holdings and Positions are shared across all users — not yet user-specific
- No real-time WebSocket feed — prices refresh every 30 seconds via polling

---

## 🔮 Planned Improvements

- [ ] User-specific holdings and positions (tie data to JWT `userId`)
- [ ] Add/remove stocks from watchlist
- [ ] WebSocket integration for real-time price streaming
- [ ] Deploy on Render (backend) + Vercel (frontend/dashboard)
- [ ] Portfolio performance chart over time

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Inspired by [Zerodha](https://zerodha.com/)
- Market data via [Yahoo Finance](https://finance.yahoo.com/) through [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
