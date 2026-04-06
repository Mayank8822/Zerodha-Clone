import React , {useState , useEffect} from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {//used to store data
  const [allHoldings, setAllHoldings] = useState([]);

useEffect(() => {
  const fetchHoldings = () => {
    axios.get("http://localhost:3002/allHoldings").then((res) =>{ //make sure server is running
      console.log(res.data);
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
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
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

          { allHoldings.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={pnlClass}>
            {pnl.toFixed(2)} ({pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph holdings={allHoldings} />
    </>
  );
};

export default Holdings;
