import React, { useState, useEffect } from "react";
import "../design/pages/ProductsPage.css";
import { Link } from "react-router-dom";

import img1 from "../components/images/1.jpg"; // if the product has no img use the default

import SearchBar from "../components/SearchBar";
import SortFilter from "../components/SortFilter";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewCounts, setReviewCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const defaultImg = img1;

  // Fetching products data
  useEffect(() => {
    fetch("http://localhost:1000/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniqueCategories = [
            ...new Set(data.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
          data.reverse();
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:1000/api/reviews/counts")
      .then((response) => {
        const reviewData = {};
        response.data.forEach((item) => {
          reviewData[item._id] = {
            count: item.count,
            avgRating: item.avgRating,
          };
        });
        setReviewCounts(reviewData);
      })
      .catch((error) => console.error("Error fetching review data:", error));
  }, []);

  const handleSort = (productsToSort) => {
    if (sortOrder === "low-to-high") {
      return [...productsToSort].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      return [...productsToSort].sort((a, b) => b.price - a.price);
    }
    return productsToSort;
  };

  const filteredProducts = handleSort(
    products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  return (
    <div className="products-page">
      <div className="search-and-filter">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <SortFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      </div>
      <main className="products-content">
        <h2 className="section-title">Products</h2>
        <ul className="products-grid">
          {filteredProducts.map((product) => {
            const reviewData = reviewCounts[product._id] || {};
            const avgRating = reviewData.avgRating || 0;
            const reviewCount = reviewData.count || 0;

            return (
              <li key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-link">
                  <img
                    src={
                      product.imageUrl
                        ? `http://localhost:1000${product.imageUrl}`
                        : defaultImg // placeholder img for now
                    }
                    alt={product.name || "Product"}
                    className="product-image"
                  />
                  <div className="product-details">
                    <p className="product-title">{product.name}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">Price: ${product.price}</p>
                    <p className="product-reviews">
                      Reviews ({reviewCount}):{" "}
                      <span className="stars-display">
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <FaStar
                              key={index}
                              size={16}
                              color={
                                index < Math.round(avgRating)
                                  ? "#FFBA5A"
                                  : "#a9a9a9"
                              }
                            />
                          ))}
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default ProductsPage;
