// src/pages/PlatformInfoPage.js
import React, { useRef } from "react";
import "../design/pages/InfoPage.css";
import FAQPage from "./FAQPage"; // Import the FAQPage

const InfoPage = () => {
  const faqRef = useRef(null);

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="platform-info-page">
      <section className="info-section">
        {/* Key Features Section */}
        <div className="info-key-features">
          <h1 className="info-title">About Our Platform</h1>
          <p className="info-description">
            Welcome to BuyEase! Our platform is designed to connect buyers and
            sellers in a seamless, user-friendly environment.
          </p>
          <h2 className="info-subtitle">Key Features:</h2>
          <ul className="info-list">
            <li>Browse, list, and search for products easily</li>
            <li>Rate and review sellers</li>
            <li>
              Maintain a profile, "to-buy" list, and cart for the best
              e-commerce experience
            </li>
          </ul>
        </div>

        {/* Our Mission Section */}
        <div className="info-mission">
          <h2 className="info-subtitle">Our Mission</h2>
          <p className="info-description">
            To make buying and selling as easy and transparent as possible.
          </p>
          <h3 className="info-slogan">By Students, For Students</h3>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQPage ref={faqRef} />
    </div>
  );
};

export default InfoPage;
