import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { useSpace } from "../../contexts/SpaceContext";
import { db } from "../firebase-config";
import Modal from "../Modal"; // Import the Modal component
import "./Chat.css";

export default function Chat() {
  const { SpCode, user } = useSpace();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatIdentity, setChatIdentity] = useState(null);
  const [showModal, setShowModal] = useState(true);

  // Listen for messages when a space code is available
  useEffect(() => {
    if (!SpCode) return;

    const messagesRef = collection(db, `spaces/${SpCode}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [SpCode]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Message expires in 7 days

    // Determine the sender's name and id based on chatIdentity
    const senderName =
      chatIdentity === "anonymous" ? "Anonymous" : user?.displayName || "Anonymous";
    const senderId =
      chatIdentity === "anonymous" ? "anonymous" : user?.uid || "Unknown";

    try {
      await addDoc(collection(db, `spaces/${SpCode}/messages`), {
        text: newMessage,
        sender: senderName,
        senderId: senderId,
        timestamp: serverTimestamp(),
        expiresAt: expiryDate, // Expiry timestamp for deletion
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteOldMessages = async () => {
    const messagesRef = collection(db, `spaces/${SpCode}/messages`);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const oldMessagesQuery = query(messagesRef, where("expiresAt", "<", sevenDaysAgo));
    const oldMessagesSnapshot = await getDocs(oldMessagesQuery);

    oldMessagesSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    alert("Messages older than 7 days have been deleted.");
  };

  // Function to handle the user identity choice
  const handleIdentityChoice = (identity) => {
    setChatIdentity(identity);
    setShowModal(false); // Hide the modal after making a choice
  };

  return (
    <div className="chat-container">
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleIdentityChoice}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Chat Room</h2>
        <button className="delete-btn" onClick={deleteOldMessages}>
          Delete Old Messages
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.senderId === user?.uid || msg.senderId === "anonymous"
                ? "own-message"
                : ""
            }`}
          >
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
