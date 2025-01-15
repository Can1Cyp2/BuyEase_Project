import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext); // Access the logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token from AuthContext and localStorage
    navigate("/"); // Redirects to the home page after logout
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
