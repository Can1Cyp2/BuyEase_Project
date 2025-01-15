// src/components/SearchBar.js
import React from "react";
// import "../design/components/SearchBar.css";
import "../design/pages/ProductsPage.css"; // Styling in product page

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-section">
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="search-button">🔍</button>
    </div>
  );
};

export default SearchBar;
