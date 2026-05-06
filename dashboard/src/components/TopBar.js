import React, { useEffect, useState } from "react";
import axios from "axios";

import Menu from "./Menu";

const TopBar = () => {
  const [indices, setIndices] = useState({
    "NIFTY 50": null,
    SENSEX: null,
  });

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await axios.post("http://localhost:3002/api/prices", {
          symbols: ["NIFTY 50", "SENSEX"],
        });

        setIndices({
          "NIFTY 50": res.data["NIFTY 50"] ?? null,
          SENSEX: res.data.SENSEX ?? null,
        });
      } catch (error) {
        console.error("Failed to fetch index prices", error);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className={`index-points ${indices["NIFTY 50"]?.isDown ? "down" : "up"}`}>
            {indices["NIFTY 50"]?.price?.toFixed(2) ?? "--"}
          </p>
          <p className="percent">{indices["NIFTY 50"]?.percent ?? ""}</p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className={`index-points ${indices.SENSEX?.isDown ? "down" : "up"}`}>
            {indices.SENSEX?.price?.toFixed(2) ?? "--"}
          </p>
          <p className="percent">{indices.SENSEX?.percent ?? ""}</p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
