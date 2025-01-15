// frontend/src/pages/ToBuyPage.js
import React, { useEffect, useState } from "react";

import "../design/pages/ToBuyPage.css";

const ToBuyPage = () => {
  const [toBuyItems, setToBuyItems] = useState([]);
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  const [hasFetchedItems, setHasFetchedItems] = useState(false);

  const isLoading = toBuyItems.length === 0 && !hasFetchedItems;

  useEffect(() => {
    const fetchToBuyItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:1000/api/to-buy/getBuyList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        setToBuyItems(data);
      } catch (error) {
        console.error("Failed to fetch to-buy items:", error);
      } finally {
        setHasFetchedItems(true);
      }
    };

    if (userId) {
      fetchToBuyItems();
    }
  }, []);
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch("http://localhost:1000/api/to-buy/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, itemId }),
      });

      if (response.ok) {
        setToBuyItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="to-buy-page">
      <div className="page-container">
        <h1 className="page-title">My To-Buy List</h1>
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : toBuyItems.length > 0 ? (
          <div className="items-grid">
            {toBuyItems.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-details">
                  <h2 className="item-name">{item.product.name}</h2>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-items-message">
            There are no items in your to-buy list.
          </p>
        )}
      </div>
    </div>
  );
};

export default ToBuyPage;
