// src/pages/FAQPage.js
import React from "react";
import "../design/pages/FAQPage.css";

const FAQPage = () => {
  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-item">
        <h2 className="faq-question">What is BuyEase?</h2>
        <p className="faq-answer">
          BuyEase is a platform for buyers and sellers to connect and transact
          easily.
        </p>
      </div>
      <div className="faq-item">
        <h2 className="faq-question">How do I create an account?</h2>
        <p className="faq-answer">
          To create an account, click the "Sign Up" button on the homepage, then
          fill in your information.
        </p>
      </div>
      <div className="faq-item">
        <h2 className="faq-question">How can I list a product?</h2>
        <p className="faq-answer">
          Click the "List a Product" button in the navigation bar and fill in
          the necessary details.
        </p>
      </div>
      <div className="faq-item">
        <h2 className="faq-question">What are the guidelines for reviews?</h2>
        <p className="faq-answer">
          Reviews must be honest and constructive. Hate speech, spam, and
          inappropriate content are strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default FAQPage;
