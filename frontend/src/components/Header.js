import React from "react";
import { Link } from "react-router-dom"; // Import useNavigate
import LogoutButton from "./LogoutButton"; // Import the LogoutButton component
import Notification from "./Notification";
import "../design/components/Header.css";

import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

/**
 * A Header component that displays the BuyEase logo, navigation links, and either a Sign In/Register button pair or a Log Out button depending on whether the user is signed in or not.
 * @param {boolean} isSignedIn Whether the user is signed in or not.
 * @param {function} onSignOut A function to call when the Log Out button is clicked.
 * @param {function} openLoginModal A function to call when the Sign In button is clicked.
 * @param {function} openSignupModal A function to call when the Register button is clicked.
 * @returns {ReactElement} The Header component.
 */
const Header = ({
  isSignedIn,
  onSignOut,
  openLoginModal,
  openSignupModal,
  cartCount = 0,
}) => {
  return (
    <header className="header-container">
      <div className="site-logo">BuyEase.ca</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products & Services</Link>
        {/* <Link to="/services">Services</Link> */}
        <Link to="/about-us">About Us</Link>
        <Link to="/list-product" className="list-product-button">
          List a Product
        </Link>
      </nav>
      <div className="auth-buttons">
      {isSignedIn && <Notification />}
        {!isSignedIn ? (
          <>
            <button className="btn" onClick={openLoginModal}>
              Sign In
            </button>
            <button className="btn" onClick={openSignupModal}>
              Register
            </button>
          </>
        ) : (
          <>
            <Link to="/cart" className="cart-btn" aria-label="View Cart">
              <FaShoppingCart size={30} color="white" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="profile-btn">
              <FaUserCircle size={40} color="white" />
            </Link>
            <LogoutButton className="logout-btn" />
            {/* Use the LogoutButton directly */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
