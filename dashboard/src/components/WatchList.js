import React, { useState, useEffect, useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import { watchlist } from "../data/data";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart";
import axios from "axios";

const WatchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveStocks, setLiveStocks] = useState(watchlist); // start with static data

  const fetchPrices = async () => {
    try {
      const symbols = watchlist.map((s) => s.name);
      const res = await axios.post("http://localhost:3002/api/prices", { symbols });
      const prices = res.data;

      setLiveStocks(
        watchlist.map((stock) =>
          prices[stock.name]
            ? { ...stock, ...prices[stock.name] } // overwrite price, percent, isDown
            : stock // fallback to static if fetch failed
        )
      );
    } catch (err) {
      console.error("Failed to fetch watchlist prices", err);
    }
  };

  useEffect(() => {
    fetchPrices(); // fetch immediately on mount
    const interval = setInterval(fetchPrices, 30000); // then every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const filteredWatchlist = liveStocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const data = {
    labels: liveStocks.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: liveStocks.map((s) => s.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: NSE, BSE, Nifty fifty Weekly, gold mcx"
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="counts">{filteredWatchlist.length}/ 50</span>
      </div>
      <ul className="list">
        {filteredWatchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>
      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchListAction, setShowWatchListAction] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchListAction(true)}
      onMouseLeave={() => setShowWatchListAction(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent ?? "--"}</span>
          {stock.isDown ? <KeyboardArrowDown className="down" /> : <KeyboardArrowUp className="up" />}
          <span className="price">
            {typeof stock.price === "number" ? stock.price.toFixed(2) : "--"}
          </span>
        </div>
      </div>
      {showWatchListAction && <WatchListAction uid={stock.name} />}
    </li>
  );
};

const WatchListAction = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow slots={{ transition: Grow }}>
          <button className="buy" onClick={() => generalContext.openBuyWindow(uid)}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow slots={{ transition: Grow }}>
          <button className="sell" onClick={() => generalContext.openSellWindow(uid)}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics (A)" placement="top" slots={{ transition: Grow }}>
          <button className="action"><BarChartOutlined className="icon" /></button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow slots={{ transition: Grow }}>
          <button className="action"><MoreHoriz className="icon" /></button>
        </Tooltip>
      </span>
    </span>
  );
};
