// src/components/Modal.js
import React from "react";
import "./../design/components/Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Function to handle clicks on the overlay (outside modal):
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
