import React, { useState } from "react";

const ListProduct = () => {
  const categories = [
    "Electronics",
    "TextBooks & Literature",
    "Clothing & Accessories",
    "Furniture",
    "Sports & Outdoors",
    "Home & Kitchen",
    "Health & Beauty",
    "Toys & Games",
    "Music & Instruments",
    "Art & Craft Supplies",
    "Services",
    "Vehicles",
    "Event Tickets",
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");

  const [image, setImage] = useState(null); // For image upload

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      //console.log(localStorage, localStorage.getItem("token"));
      const response = await fetch("http://localhost:1000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      // Step 2: Upload the image if product creation is successful
      if (response.ok && image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("productId", data._id); // Include data ID

        const uploadResponse = await fetch(
          "http://localhost:1000/api/products/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      if (response.ok) {
        alert("Product listed successfully!");
        setFormData({ name: "", price: "", description: "", category: "" }); // Reset form
      } else {
        setError(data.message || "Failed to list product.");
      }
    } catch (error) {
      setError(error.message || "Error listing product. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
        required
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "104%",
          marginBottom: "15px",
        }}
      >
        <span
          style={{
            padding: "10px",
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            borderRadius: "4px 0 0 4px",
          }}
        >
          $
        </span>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "0 4px 4px 0",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
          }}
          required
        />
      </div>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          backgroundColor: "#fff",
        }}
        required
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{
          width: "100%",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          backgroundColor: "#fff",
        }}
      />

      <button
        type="submit"
        style={{
          width: "104%",
          padding: "10px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#444",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        List Product
      </button>
      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
    </form>
  );
};

export default ListProduct;
