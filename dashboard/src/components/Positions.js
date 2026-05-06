import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      const res = await axios.get("http://localhost:3002/allPositions");
      const positions = res.data;

      if (positions.length === 0) {
        setAllPositions([]);
        return;
      }

      const symbols = positions.map((p) => p.name);
      try {
        const priceRes = await axios.post("http://localhost:3002/api/prices", { symbols });
        const prices = priceRes.data;

        const updated = positions.map((p) =>
          prices[p.name]
            ? { ...p, price: prices[p.name].price, day: prices[p.name].percent, isLoss: prices[p.name].isDown }
            : p
        );
        setAllPositions(updated);
      } catch {
        setAllPositions(positions);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-muted fs-4">Positions</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Day chg.</th>
          </tr>
        </thead>
        <tbody>
          {allPositions.map((pos, index) => {
            const pnl = (pos.price - pos.avg) * pos.qty;
            const pnlClass = pnl >= 0 ? "profit" : "loss";
            return (
              <tr key={index}>
                <td>{pos.product}</td>
                <td>{pos.name}</td>
                <td>{pos.qty}</td>
                <td>{pos.avg?.toFixed(2)}</td>
                <td>{pos.price?.toFixed(2)}</td>
                <td className={pnlClass}>{pnl.toFixed(2)}</td>
                <td className={pos.isLoss ? "loss" : "profit"}>{pos.day}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Positions;