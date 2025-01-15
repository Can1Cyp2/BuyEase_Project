// src/components/Checkout.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [step, setStep] = useState(1); // Track which step the user is on
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [items, setItems] = useState([]); // Fetch these from cart or API
  const [totalAmount, setTotalAmount] = useState(0); // Calculate from items

  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handlePaymentSelect = (method) => setSelectedPaymentMethod(method);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("http://localhost:1000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items,
          totalAmount,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/order-confirmation/${data._id}`); // Redirect to order confirmation page
      } else {
        console.error("Order placement failed.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Review Cart</h2>
          {/* Map items here */}
          {items.map((item) => (
            <div key={item.productId}>
              <p>Product: {item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Confirm Details</h2>
          {/* Display order summary, address, etc. */}
          <p>Total Amount: ${totalAmount}</p>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Select Payment Method</h2>
          <button onClick={() => handlePaymentSelect("Credit Card")}>
            Credit Card
          </button>
          <button onClick={() => handlePaymentSelect("PayPal")}>PayPal</button>
          <button onClick={handleBack}>Back</button>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
