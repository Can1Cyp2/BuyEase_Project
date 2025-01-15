// src/components/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../design/components/Modal.css"; // Assuming we already have basic styles here

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission of the login form.
   *
   * This function sends a POST request to the backend's /api/login endpoint with
   * the email and password entered in the form. If the request is successful, it
   * logs the user in and redirects them to the homepage. If the request fails, it
   * sets an error message.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:1000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.token) {
        login(data.token, formData.email);
        onClose();
        navigate("/");
      } else {
        setErrorMessage(
          "Invalid email or password. If you would like to reset your password or email, please contact us at BuyEaseProject@gmail.com"
        ); // Set error message if login fails
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred. Please try again."); // Handle general errors
    }
  };

  return (
    <div className="login-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="modal-form">
        <h2>Sign In</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
