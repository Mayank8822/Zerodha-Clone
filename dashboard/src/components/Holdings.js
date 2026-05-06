import React, { useEffect, useState } from "react";
import axios from "axios";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get("http://localhost:3002/allHoldings");
        const holdings = res.data;

        if (holdings.length === 0) {
          setAllHoldings([]);
          return;
        }

        const symbols = holdings.map((holding) => holding.name);

        try {
          const priceRes = await axios.post("http://localhost:3002/api/prices", {
            symbols,
          });
          const prices = priceRes.data;

          const updated = holdings.map((holding) => {
            const livePrice = prices[holding.name];

            if (!livePrice) {
              return holding;
            }

            const netPercent = ((livePrice.price - holding.avg) / holding.avg) * 100;

            return {
              ...holding,
              price: livePrice.price,
              day: livePrice.percent,
              net: `${netPercent >= 0 ? "+" : ""}${netPercent.toFixed(2)}%`,
              isLoss: netPercent < 0,
            };
          });

          setAllHoldings(updated);
        } catch {
          setAllHoldings(holdings);
        }
      } catch (error) {
        console.error("Failed to fetch holdings", error);
      }
    };

    fetchHoldings();
    const interval = setInterval(fetchHoldings, 30000);
    window.addEventListener("portfolioUpdated", fetchHoldings);

    return () => {
      clearInterval(interval);
      window.removeEventListener("portfolioUpdated", fetchHoldings);
    };
  }, []);

  return (
    <div>
      <h2 className="text-muted fs-4">Holdings ({allHoldings.length})</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
        </thead>
        <tbody>
          {allHoldings.map((holding, index) => {
            const currentValue = holding.price * holding.qty;
            const investmentValue = holding.avg * holding.qty;
            const pnl = currentValue - investmentValue;
            const pnlClass = pnl >= 0 ? "profit" : "loss";
            const dayClass = holding.day?.startsWith("-") ? "loss" : "profit";

            return (
              <tr key={`${holding.name}-${index}`}>
                <td>{holding.name}</td>
                <td>{holding.qty}</td>
                <td>{holding.avg?.toFixed(2)}</td>
                <td>{holding.price?.toFixed(2)}</td>
                <td>{currentValue.toFixed(2)}</td>
                <td className={pnlClass}>{pnl.toFixed(2)}</td>
                <td className={holding.isLoss ? "loss" : "profit"}>{holding.net}</td>
                <td className={dayClass}>{holding.day}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Holdings;
