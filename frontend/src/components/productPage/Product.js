// frontend/src/components/productPage/Product.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import img1 from "../images/1.jpg";
import img2 from "../images/2.jpg";
import img3 from "../images/3.jpg";
import img4 from "../images/4.jpg";
import "../../design/components/productPage/Product.css";
import Review from "../productPage/Review";

import axios from "axios";
import { FaStar } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

import { FaShareAlt } from "react-icons/fa"; // Share Icon
import { useNavigate } from "react-router-dom";

const defaultImages = [img1, img2, img3, img4];

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Gets product ID from URL
  const { token, isSignedIn } = useContext(AuthContext); // Get the token and isSignedIn status from the AuthContext
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(defaultImages[0]);
  const [items, setItems] = useState(1);
  const [cart, setCart] = useState(0);
  const shadowRef = useRef(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = () => {
    axios
      .get(`http://localhost:1000/api/reviews/${productId}`)
      .then((response) => {
        const reviews = response.data;
        setReviewCount(reviews.length);
        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.customerRating,
            0
          );
          setAverageRating(totalRating / reviews.length);
        } else {
          setAverageRating(0);
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  };

  useEffect(() => {
    // Fetch product details
    fetch(`http://localhost:1000/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        if (data.imageUrl) {
          setMainImage(`http://localhost:1000${data.imageUrl}`);
        } else if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        } else {
          setMainImage(defaultImages[0]);
        }
      })
      .catch((err) => console.error("Error fetching product:", err));

    // Fetch reviews initially
    fetchReviews();
  }, [productId]);
  useEffect(() => {
    axios
      .get(`http://localhost:1000/api/reviews/${productId}`)
      .then((response) => {
        console.log("Product reviews:", response.data); // Debug API response
      });
  }, [productId]);

  // Function to handle adding items to the to-buy list
  const handleAddToBuyList = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      alert("You need to sign in to add items to your To-Buy List.");
      return;
    }

    try {
      const response = await fetch("http://localhost:1000/api/to-buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId, // Pass the product ID
          quantity: items, // Pass the selected quantity
          userId, // Include the user ID
        }),
      });

      if (response.ok) {
        alert(`${product.name} has been added to your To-Buy List!`);
      } else {
        const error = await response.json();
        alert(`Failed to add item: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding to To-Buy List:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const images = [];
  if (product.imageUrl) {
    images.push(`http://localhost:1000${product.imageUrl}`);
  }
  if (product.images && product.images.length > 0) {
    images.push(...product.images);
  }
  if (images.length === 0) {
    images.push(...defaultImages);
  }

  const handleShare = () => {
    const productUrl = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(productUrl);
    alert("Product link copied to clipboard! Share it with your friends.");
  };

  const handleStartChat = (username) => {
    if (!username) return; // terminates if no username
    localStorage.setItem("targetReceiver", username); // save username
    navigate("/chat"); // navigate to chat
  };

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItemIndex = cartItems.findIndex((item) => item._id === productId);

    if (existingItemIndex > -1) {
      // Update the quantity of an existing item
      cartItems[existingItemIndex].quantity += items;
    } else {
      // Add a new item to the cart
      cartItems.push({
        _id: productId,
        name: product.name,
        price: product.price,
        description: product.description,
        image: mainImage,
        quantity: items,
        stock: product.stock || 10, // Assuming stock is available in product object
      });
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert(`${product.name} has been added to the cart!`);
  };


  return (
    <div className="prod-sec content-div">
      <div ref={shadowRef} className="shadow"></div>
      <div className="product-container">
        <div className="left-column">
          <div className="main-image-container">
            <img
              src={mainImage}
              alt={product.name || "Product"}
              className="main-image"
            />
          </div>
          <div className="image-gallery">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="right-column">
          <h1 className="main-heading">{product.name || "Product Name"}</h1>
          <p className="prod-subHeading">
            {product.category || "Type of Product"}
          </p>
          <div className="prod-price">
            {product.oldPrice && (
              <span className="old-price">${product.oldPrice}</span>
            )}
            <span className="new-price">${product.price || "0.00"}</span>
          </div>
          <p>
            {reviewCount} Review(s) - Rating:{" "}
            <span className="stars-display">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <FaStar
                    key={index}
                    size={18}
                    color={
                      index < Math.round(averageRating) ? "#FFBA5A" : "#a9a9a9"
                    }
                  />
                ))}
            </span>
          </p>
          <div className="cart-controls">
            <button
              className="minus"
              onClick={() => setItems(Math.max(items - 1, 0))}
            >
              -
            </button>
            <span className="item-count">{items}</span>
            <button className="plus" onClick={() => setItems(items + 1)}>
              +
            </button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          {/* button for To-Buy List: */}
          <button className="add-to-buy-list-btn" onClick={handleAddToBuyList}>
            Save to To-Buy List
          </button>
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "Product description goes here..."}</p>
          </div>
          {/* Share Button: */}
          <button className="share-button" onClick={handleShare}>
            <FaShareAlt /> Share
          </button>
        </div>

        {/* Seller Information Section */}
        <div className="seller-info">
          <h3>Seller Information</h3>
          <p>
            <strong>Name:</strong>
            <div className="seller-value">
              {product.seller?.name || "Not available"}
            </div>
          </p>
          <p>
            <strong>Email:</strong>
            <div className="seller-value">
              {product.seller?.email || "Not available"}
            </div>
          </p>
          {product.seller?.name && (
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#ffffff",
                backgroundColor: "#4caf50",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s, box-shadow 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "#45a049")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#4caf50")
              }
              onClick={() => handleStartChat(product.seller?.name)}
            >
              💬 Chat with Seller
            </button>
          )}

        </div>

      </div>
      <Review
        productId={productId}
        setReviewCount={setReviewCount}
        onReviewChange={fetchReviews}
      />
    </div>
  );
};

export default Product;
