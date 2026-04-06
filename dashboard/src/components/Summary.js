import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = () => {
      axios.get("http://localhost:3002/allHoldings").then((res) => {
        setAllHoldings(res.data);
      });
    };

    fetchHoldings();
    window.addEventListener("portfolioUpdated", fetchHoldings);

    return () => {
      window.removeEventListener("portfolioUpdated", fetchHoldings);
    };
  }, []);

  const totalInvestment = allHoldings.reduce(
    (total, stock) => total + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (total, stock) => total + stock.price * stock.qty,
    0
  );
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment ? (pnl / totalInvestment) * 100 : 0;
  const pnlClass = pnl >= 0 ? "profit" : "loss";

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {pnl.toFixed(2)} <small>{pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{currentValue.toFixed(2)}</span>{" "}
            </p>
            <p>
              Investment <span>{totalInvestment.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
