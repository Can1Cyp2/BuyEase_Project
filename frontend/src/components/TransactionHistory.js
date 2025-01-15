// src/components/TransactionHistory.js

import React, { useState } from "react";

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]); // Holds transaction data

  const handleMockTransactions = () => {
    const mockOrders = [
      {
        _id: "1",
        purchaseDate: new Date().toISOString(),
        totalAmount: 80,
        items: [
          {
            _id: "1",
            name: "Mock Product A",
            price: 20,
            quantity: 2,
            image: "https://via.placeholder.com/150",
          },
          {
            _id: "2",
            name: "Mock Product B",
            price: 15,
            quantity: 2,
            image: "https://via.placeholder.com/150",
          },
        ],
      },
      {
        _id: "2",
        purchaseDate: new Date().toISOString(),
        totalAmount: 30,
        items: [
          {
            _id: "3",
            name: "Mock Product C",
            price: 10,
            quantity: 3,
            image: "https://via.placeholder.com/150",
          },
        ],
      },
    ];
    setOrders(mockOrders); // Populate with mock data
  };

  return (
    <div>
      <h2>Transaction History</h2>
      <button onClick={handleMockTransactions}>Load Mock Transactions</button>
      {orders.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.purchaseDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
            <h3>Items</h3>
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "50px", height: "50px" }}
                />
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
//should be ready for merge with main

export default TransactionHistory;

// import React, { useEffect, useState } from "react";

// const TransactionHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTransactionHistory = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:1000/api/orders/history",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setOrders(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching transaction history:", error);
//         setLoading(false);
//       }
//     };
//     fetchTransactionHistory();
//   }, []);

//   if (loading) {
//     return <p>Loading transaction history...</p>;
//   }

//   return (
//     <div>
//       <h2>Transaction History</h2>
//       {orders.length === 0 ? (
//         <p>No transactions found.</p>
//       ) : (
//         orders.map((order) => (
//           <div key={order._id} className="order-card">
//             <p>
//               Order Date: {new Date(order.purchaseDate).toLocaleDateString()}
//             </p>
//             <p>Total Amount: ${order.totalAmount}</p>
//             <h3>Items</h3>
//             {order.items.map((item, index) => (
//               <div key={index}>
//                 <p>Product ID: {item.product}</p>
//                 <p>Quantity: {item.quantity}</p>
//               </div>
//             ))}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;
