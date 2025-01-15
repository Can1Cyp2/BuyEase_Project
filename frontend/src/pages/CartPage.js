// CartPage.js
import React, { useState, useEffect } from "react";
import "../design/pages/CartPage.css";
import iconDelete from "../components/images/icon-delete.svg";

const CartPage = ({ updateCart }) => {
  // load initial cart items from local storage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // calculate total price whenever cartItems changes
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // save cart items to local storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, newQuantity, stock) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const addMockProducts = () => {
    const mockProducts = [
      {
        _id: "1",
        name: "Mock Product A testing",
        price: 20,
        description: "A great product",
        category: "Category A",
        seller: "Seller ID 1",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150",
        quantity: 2,
        stock: 5,
      },
      {
        _id: "2",
        name: "Mock Product B",
        price: 15,
        description: "Another amazing product",
        category: "Category B",
        seller: "Seller ID 2",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150",
        quantity: 1,
        stock: 3,
      },
      {
        _id: "3",
        name: "Mock Product C",
        price: 10,
        description: "Best value product testing",
        category: "Category C",
        seller: "Seller ID 3",
        createdAt: new Date().toISOString(),
        image: "https://via.placeholder.com/150",
        quantity: 3,
        stock: 4,
      },
    ];
    setCartItems(mockProducts);
  };

  // paceholder function for handling place order
  const handlePlaceOrder = () => {
    alert(`Order placed! Total price: $${totalPrice}`);
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      <button onClick={addMockProducts} className="test-add-products-button">
        Test Add Products
      </button>

      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <div className="cart-item-info">
                  <p>${item.price}</p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.quantity - 1,
                          item.stock
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.quantity + 1,
                          item.stock
                        )
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="delete-button"
                  >
                    <img src={iconDelete} alt="Delete" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="total-price">Total Price: ${totalPrice}</div>
          <button className="place-order-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
