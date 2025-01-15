import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import ProductsPage from "../pages/ProductsPage";
import Product from "./productPage/Product";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/CartPage";
import Header from "./Header";
import Modal from "./Modal";
import Login from "./Login";
import Signup from "./Signup";
import ListProduct from "../components/ListProduct";
import AccountVerification from "../pages/AccountVerificationPage";
import PlatformInfoPage from "../pages/InfoPage";
import ToBuyPage from "../pages/ToBuyPage";
import ChatPage from "../pages/ChatPage";

/**
 * The main content component, which renders the header, login/signup modals
 * and routes configuration.
 *
 * The component uses the `AuthContext` to get the current token and logout
 * function. If the token is present, the header shows the logout button.
 *
 * The component also receives callbacks to open and close the login/signup
 * modals.
 *
 */
function ContentWithAuth({
  openLoginModal,
  openSignupModal,
  isLoginModalOpen,
  closeLoginModal,
  isSignupModalOpen,
  closeSignupModal,
}) {
  const { token, logout } = useContext(AuthContext);
  const isSignedIn = !!token; // signed-in status

  return (
    <Router>
      <div className="App">
        <Header
          isSignedIn={isSignedIn} // Pass `isSignedIn` to Header
          onSignOut={logout}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />

        {/* Login Modal */}
        <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
          <Login onClose={closeLoginModal} />
        </Modal>

        {/* Signup Modal */}
        <Modal isOpen={isSignupModalOpen} onClose={closeSignupModal}>
          <Signup onClose={closeSignupModal} />
        </Modal>

        {/* Routes Configuration */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/profile" element={<ProfilePage />} />{" "}
          {/* ^Profile Page */}
          <Route path="/list-product" element={<ListProduct />} />{" "}
          <Route
           
            path="/account-verification"
           
            element={<AccountVerification />}
         
          />{" "}
          {/* ^List Product*/}
          <Route
            path="/product/:productId"
            element={<Product isSignedIn={isSignedIn} token={token} />}
          />
          {/* ^Dynamic route for ProductPage */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* ^Profile Page */}
          <Route path="/list-product" element={<ListProduct />} />
          {/* ^List Product */}
          <Route path="/about-us" element={<PlatformInfoPage />} />
          <Route path="/to-buy" element={<ToBuyPage />} />{" "}
          {/* ^Add To-Buy Page Route */}
          {/* ^Chat Page */}
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default ContentWithAuth;
