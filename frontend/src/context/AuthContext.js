// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Synchronize the state with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Define login and logout functions
  const login = (newToken, userId) => {
    setToken(newToken);
    localStorage.setItem("userId", userId); // Store the user's ID after login
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("userId"); // Clear userId on logout
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ token, isSignedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
