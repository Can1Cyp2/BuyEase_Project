import React, { useState, useEffect } from "react";

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null); // Current user information
  const [receiverId, setReceiverId] = useState(""); // Target user ID for chat
  const [receiverName, setReceiverName] = useState(""); // Target user name to display
  const [messages, setMessages] = useState([]); // Chat messages
  const [recentChats, setRecentChats] = useState([]); // List of recent chats
  const [newMessage, setNewMessage] = useState(""); // New message input
  const [error, setError] = useState(""); // Error message
  const [isConnecting, setIsConnecting] = useState(false); // Controls whether to connect

  // Check localStorage for targetReceiver and initialize chat
  useEffect(() => {
    const targetReceiver = localStorage.getItem("targetReceiver");
    if (targetReceiver) {
      setReceiverId(targetReceiver);
      setReceiverName(targetReceiver);
      setIsConnecting(true); // Trigger connection for the stored target
      localStorage.removeItem("targetReceiver"); // Clear after use
    }
  }, []);

  // Fetch current user information
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, user is not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:1000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch current user: ${response.statusText}`);
        const data = await response.json();
        setCurrentUser(data); // Set current user information
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch recent chats for the current user
  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!currentUser) return;

      try {
        const apiUrl = `http://localhost:1000/api/all-chats/${currentUser.name}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch chats: ${response.statusText}`);
        const data = await response.json();
        setRecentChats(data);

        // Automatically select the first chat on initial load
        if (data.length > 0 && !receiverId) {
          setReceiverId(data[0].name);
          setReceiverName(data[0].name);
        }
        setError("");
      } catch (err) {
        console.error("Fetch chats error:", err);
        setError(err.message);
      }
    };

    fetchRecentChats();
  }, [currentUser]);

  // Fetch messages when connecting
  useEffect(() => {
    if (isConnecting && receiverId) {
      establishChatLink();
      setIsConnecting(false); // Reset connecting state after the operation
    }
  }, [isConnecting, receiverId]);

  // Fetch messages for the selected receiver
  const establishChatLink = async () => {
    if (!receiverId.trim()) {
      setError("Please enter a valid receiver username.");
      return;
    }

    if (!currentUser?.name) {
      setError("Current user is not defined.");
      return;
    }

    try {
      const apiUrl = `http://localhost:1000/api/messages/${currentUser.name}/${receiverId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch messages: ${response.statusText}`);
      const data = await response.json();
      setMessages(data); // Set chat messages
      setReceiverName(receiverId); // Ensure the name is updated
      setError("");
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.message);
    }
  };

  // Handle adding a contact manually and fetching messages
  const handleAddContact = () => {
    if (!receiverId.trim()) {
      setError("Please enter a valid username to add.");
      return;
    }
    setIsConnecting(true); // Trigger connection
  };

  // Handle selecting a recent chat
  const handleChatSelection = (chatName) => {
    if (!chatName) {
      setError("Invalid chat selection.");
      return;
    }
    setReceiverId(chatName); // Update receiverId
    setReceiverName(chatName); // Update receiverName
    setIsConnecting(true); // Trigger connection
    setError(""); // Clear any previous errors
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const apiUrl = "http://localhost:1000/api/messages";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser.name,
          receiver: receiverName,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error(`Failed to send message: ${response.statusText}`);
      const data = await response.json();
      setMessages([...messages, data]); // Append the new message
      setNewMessage(""); // Clear input field
      setError("");
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar for recent chats */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          padding: "1em",
        }}
      >
        <h3>Recent Chats</h3>
        {/* Add Contact */}
        <div style={{ display: "flex", marginBottom: "1em" }}>
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Add contact"
            style={{
              flex: 1,
              padding: "0.5em",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "0.5em",
            }}
          />
          <button
            onClick={handleAddContact} // Fetch messages only on button press
            style={{
              padding: "0.5em 1em",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
        {/* List of recent chats */}
        {recentChats.length > 0 ? (
          recentChats.map((chat, index) => (
            <div
              key={index}
              onClick={() => handleChatSelection(chat.name)}
              style={{
                padding: "0.5em",
                cursor: "pointer",
                backgroundColor: receiverName === chat.name ? "#f0f0f0" : "transparent",
                borderRadius: "4px",
                marginBottom: "0.5em",
              }}
            >
              {chat.name}
            </div>
          ))
        ) : (
          <p>No recent chats</p>
        )}
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, padding: "1em" }}>
        {error && <p style={{ color: "red", marginBottom: "1em" }}>Error: {error}</p>}
        <h1>Chat with {receiverName || "..."}</h1>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1em",
            maxHeight: "400px",
            overflowY: "auto",
            marginBottom: "1em",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === currentUser.name ? "right" : "left",
                  margin: "0.5em 0",
                }}
              >
                <strong>{msg.sender === currentUser.name ? "You" : receiverName}:</strong>{" "}
                {msg.content}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#aaa" }}>No messages yet. Start the conversation!</p>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.5em",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "0.5em",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "0.5em 1em",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
