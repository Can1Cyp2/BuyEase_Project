import React, { useState, useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import ContentWithAuth from "./components/ContentWithAuth";
import "./App.css";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  return (
    <AuthProvider>
      <ContentWithAuth
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        isLoginModalOpen={isLoginModalOpen}
        closeLoginModal={closeLoginModal}
        isSignupModalOpen={isSignupModalOpen}
        closeSignupModal={closeSignupModal}
      />
    </AuthProvider>
  );
}

export default App;
