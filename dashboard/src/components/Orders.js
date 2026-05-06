import React , {useEffect , useState} from "react";
import axios from "axios";

const Orders = () => {
  const [NewOrder , setNewOrders] = useState([]);
  useEffect(() => {
   const fetchOrders = () => {
    axios 
      .get("http://localhost:3002/allOrders")
      .then((res) => {
        setNewOrders(res.data);
      })
      .catch((err) => console.log(err));
   };

   fetchOrders();
   window.addEventListener("portfolioUpdated", fetchOrders);

   return () => {
    window.removeEventListener("portfolioUpdated", fetchOrders);
   };
  }, []);

  return (
    <div>
    <h2 className="text-muted fs-4"> Orders</h2>

    <table className="order-table">
      <thead>
        <tr>
          <th>Stock</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Mode</th>
        </tr>
      </thead>

      <tbody>
        {NewOrder.map((NewOrder, index) => (
          <tr key={index}>
            <td>{NewOrder.name}</td>
            <td>{NewOrder.qty}</td>
            <td>{NewOrder.price}</td>
            <td>{NewOrder.mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default Orders;
