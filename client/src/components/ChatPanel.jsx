import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Xmark } from "../assets/icons";
import { socket } from "../api/socket";
import { useAppContext } from "../provider/AppStates";

// Dummy users for demonstration
const dummyUsers = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Mike Johnson' },
];

// Keep track of assigned users to ensure uniqueness
const assignedUsers = new Map();

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { session } = useAppContext();
  const messagesEndRef = useRef(null);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [myUsername, setMyUsername] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Assign a unique username when the component mounts
  useEffect(() => {
    if (!myUsername) {
      const availableUsers = dummyUsers.filter(user => !assignedUsers.has(user.id));
      if (availableUsers.length > 0) {
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        assignedUsers.set(randomUser.id, socket.id);
        setMyUsername(randomUser.name);
      }
    }

    return () => {
      // Clean up assigned user when component unmounts
      if (myUsername) {
        const user = dummyUsers.find(u => u.name === myUsername);
        if (user) {
          assignedUsers.delete(user.id);
        }
      }
    };
  }, [myUsername]);

  useEffect(() => {
    if (session) {
      socket.on("chatMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        // Set active speaker when a message is received
        setActiveSpeaker(message.sender);
        // Clear active speaker after 3 seconds
        setTimeout(() => setActiveSpeaker(null), 3000);
      });
    }

    return () => {
      socket.off("chatMessage");
    };
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !myUsername) return;

    const message = {
      text: newMessage,
      sender: socket.id,
      username: myUsername,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chatMessage", { message, room: session });
    setNewMessage("");
  };

  return (
    <div className="chat-panel">
      <button
        className="chat-button"
        onClick={() => setIsOpen(true)}
        style={{ marginRight: "10px" }}
      >
        Chat
      </button>

      {isOpen && (
        <div className="collaborationContainer">
          <motion.div
            className="collaborationBoxBack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          ></motion.div>
          <motion.section
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="chatBox"
          >
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="closeCollbBox"
            >
              <Xmark />
            </button>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === socket.id ? "sent" : "received"
                  } ${activeSpeaker === msg.sender ? "active-speaker" : ""}`}
                >
                  <div className="message-header">
                    <span className="username">{msg.username || "Anonymous"}</span>
                  </div>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </motion.section>
        </div>
      )}
    </div>
  );
} 