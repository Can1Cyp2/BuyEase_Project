// src/components/Signup.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Signup is a React component that displays a form for signing up.
 *
 * When the form is submitted, it sends a POST request to the backend's
 * /api/register endpoint with the form data. If the request is successful, it
 * logs the user in and closes the modal. If the request fails, it displays an
 * error message.
 *
 * @param {function} onClose - A function to call when the modal should be
 *   closed.
 * @returns {React.ReactElement} A React element representing the signup form.
 */
const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handles changes to the signup form by updating the form data state.
   *
   * @param {Event} e - The change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission of the signup form.
   *
   * This function sends a POST request to the backend's /api/register endpoint
   * with the form data. If the request is successful, it logs the user in and
   * redirects them to the homepage. If the request fails, it sets an error
   * message.
   *
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:1000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.token) {
        login(data.token, data.email);
        onClose();
        navigate("/");
      } else {
        console.error("Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <h2>Sign Up</h2>
      <input
        name="name"
        type="text"
        placeholder="Name"
        onChange={handleChange}
        required
      />
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
