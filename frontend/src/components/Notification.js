import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import "../design/components/Notification.css";

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true); // Initially, there is a new notification

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // Mark the notification as read when the dropdown is opened
    if (hasNewNotification) {
      setHasNewNotification(false);
    }
  };

  return (
    <div className="notification-container">
      <div
        className={`notification-bell`}
        onClick={toggleNotifications}
      >
        <FaBell />
        {/* Show the dot only if there is a new notification */}
        {hasNewNotification && <span className="notification-dot"></span>}
      </div>
      {showNotifications && (
        <div className="notification-dropdown">
          <p>
            <strong>New product is here!</strong>
          </p>
          <p>Check this out now and stay updated with the latest offerings!</p>
        </div>
      )}
    </div>
  );
};

export default Notification;
