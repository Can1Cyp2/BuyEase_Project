import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../design/pages/ProfilePage.css";
import TransactionHistory from "../components/TransactionHistory";
import defaultAvatar from "../components/images/defaultAvatar.png"; // Path to defaultAvatar
import AccountVerificationPage from "./AccountVerificationPage";



const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: "", email: "", notificationsEnabled: true} );
  const [newData, setNewData] = useState({ name: "", email: "", password: "", notificationsEnabled: true });
  const [showHistory, setShowHistory] = useState(false); // State to show/hide transaction history
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    notificationsEnabled: false,
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Displays the most recently registered user
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, user is not logged in");
        return;
      }

      try {
        const profileRes = await fetch("http://localhost:1000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData);
          setNewData({
            name: profileData.name,
            email: profileData.email,
            bio: profileData.bio,
            notificationsEnabled: profileData.notificationsEnabled,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async (field) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Email validation before saving
    if (field === "email" && !validateEmail(newData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const updatedData = {};
      updatedData[field] = newData[field];

      // Check if the field is 'password' and handle accordingly
      if (field === "password") {
        if (
          !newData.currentPassword ||
          !newData.newPassword ||
          !newData.confirmNewPassword
        ) {
          alert("Please fill in all password fields.");
          return;
        }

        // Validate password match
        if (newData.newPassword !== newData.confirmNewPassword) {
          alert("New password and confirm password do not match.");
          return;
        }

        // Add current and new password to the update payload
        updatedData.currentPassword = newData.currentPassword;
        updatedData.newPassword = newData.newPassword;
      }

      const response = await fetch("http://localhost:1000/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          [field]: field === "password" ? "******" : newData[field],
        }));
        setIsEditing({ ...isEditing, [field]: false });
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(
          `Failed to update profile: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
  };

  const handleCancel = (field) => {
    setNewData({ ...newData, [field]: profile[field] });
    if (field === "password") {
      setNewData((prevData) => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    }
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  useEffect(() => {
    // Check if there's a saved image in localStorage or fallback to default
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImage(savedImage);
    } else {
      setImage(defaultAvatar);
    }
  }, []);

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImage(base64Image);
        localStorage.setItem("profileImage", base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete image (reset to default)
  const handleDeleteImage = () => {
    localStorage.removeItem("profileImage");
    setImage(defaultAvatar); // Set to default avatar
  };

  return (
    <div className="profile-page">
      {/* Profile picture container */}
      <div className="profile-picture-container">
        <img
          src={image || defaultAvatar}
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <div className="upload-button-container">
        <input
          type="file"
          id="uploadProfilePic"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <button
          onClick={() => document.getElementById("uploadProfilePic").click()}
          className="upload-button"
        >
          Change Profile Picture
        </button>
      </div>

      <div className="delete-button-container">
        {image !== defaultAvatar && (
          <button onClick={handleDeleteImage} className="delete-button">
            Delete Image
          </button>
        )}
      </div>

      {/* To-Buy List Button */}
      <div className="to-buy-section">
        <button className="to-buy-btn" onClick={() => navigate("/to-buy")}>
          View My To-Buy List
        </button>
      </div>

      {/* Profile header */}
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      {/* Bio Section */}
      <div className="profile-section">
        <label>Bio:</label>
        {isEditing.bio ? (
          <div>
            <textarea
              name="bio"
              value={newData.bio}
              onChange={handleChange}
              className="profile-input"
              placeholder="Tell us about yourself"
            />
            <button onClick={() => handleSave("bio")} className="save-btn">
              Save
            </button>
            <button onClick={() => handleCancel("bio")} className="cancel-btn">
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-display">
            <span>{profile.bio || "No bio available"}</span>
            <button onClick={() => handleEdit("bio")} className="edit-btn">
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Name Section */}
      <div className="profile-section">
        <label>Name:</label>
        {isEditing.name ? (
          <div>
            <input
              type="text"
              name="name"
              value={newData.name}
              onChange={handleChange}
              className="profile-input"
            />
            <button onClick={() => handleSave("name")} className="save-btn">
              Save
            </button>
            <button onClick={() => handleCancel("name")} className="cancel-btn">
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-display">
            <span>{profile.name}</span>
            <button onClick={() => handleEdit("name")} className="edit-btn">
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Email Section */}
      <div className="profile-section">
        <label>Email:</label>
        {isEditing.email ? (
          <div>
            <input
              type="email"
              name="email"
              value={newData.email}
              onChange={handleChange}
              className="profile-input"
            />
            <button onClick={() => handleSave("email")} className="save-btn">
              Save
            </button>
            <button
              onClick={() => handleCancel("email")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-display">
            <span>{profile.email}</span>
            <button onClick={() => handleEdit("email")} className="edit-btn">
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="profile-section">
        <label>Current Password:</label>
        {isEditing.password ? (
          <div>
            <input
              type="password"
              name="currentPassword"
              value={newData.currentPassword}
              onChange={handleChange}
              className="profile-input"
              placeholder="Enter current password"
            />
            <input
              type="password"
              name="newPassword"
              value={newData.newPassword}
              onChange={handleChange}
              className="profile-input"
              placeholder="New password"
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={newData.confirmNewPassword}
              onChange={handleChange}
              className="profile-input"
              placeholder="Confirm new password"
            />
            <div className="buttons-container">
              <button
                onClick={() => handleSave("password")}
                className="save-btn"
              >
                Save
              </button>
              <button
                onClick={() => handleCancel("password")}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-display">
            <span>{profile.password}</span>
            <button onClick={() => handleEdit("password")} className="edit-btn">
              Change Password
            </button>
          </div>
        )}
      </div>
     {/* Notification Preferences Section */}
     <div className="notification-preferences">
        <label>Notifications:</label>
        {isEditing.notificationsEnabled ? (
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={newData.notificationsEnabled ?? true}
                onChange={handleChange}
              />
              Enable Notifications
            </label>
            <button
              onClick={() => handleSave('notificationsEnabled')} // Save the new preference
              className="save-btn"
            >
              Save
            </button>
            <button
              onClick={() => handleCancel('notificationsEnabled')} // Revert to original value
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-display">
            <span>
              {profile.notificationsEnabled ?? true // Default to true if undefined
                ? "Notifications Enabled"
                : "Notifications Disabled"}
            </span>
            <button
              onClick={() =>
                setIsEditing((prev) => ({
                  ...prev,
                  notificationsEnabled: true, // Enter edit mode
                }))
              }
              className="edit-btn"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      
     {/* Add Account Verification Section */}
      <div className="account-verification-section">
        <AccountVerificationPage />
      </div>
      <button
        className="transaction-history-button"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? "Hide Transaction History" : "Show Transaction History"}
      </button>
      {showHistory && (
        <div className="transaction-history">
          <TransactionHistory />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;