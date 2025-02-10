import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpace } from "../contexts/SpaceContext";
import "./EnterCode.css"; // Import styles
import star from "../assets/stars.png";
import copy from "../assets/duplicate.png";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [newSpaceCode, setNewSpaceCode] = useState("");
  const [newSpaceName, setNewSpaceName] = useState("");
  const navigate = useNavigate();
  const { setSpCode } = useSpace();

  const BASE_URL = "https://azign-backend.onrender.com";

  // Redirect if space code already exists in localStorage
  useEffect(() => {
    const storedCode = localStorage.getItem("SpCode");
    if (storedCode) {
      navigate(`${BASE_URL}/space/${storedCode}`);
    }
  }, [navigate]);

  const handleEnter = () => {
    if (code.trim() && code !== localStorage.getItem("SpCode")) {
      setSpCode(code);
      localStorage.setItem("SpCode", code);
      navigate(`/space/${code}`);
    }
  };

  const handleCreateSpace = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/space/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SpCode: newSpaceCode, name: newSpaceName }),
      });

      const data = await response.json();
      if (response.ok) {
        setSpCode(data.SpCode);
        localStorage.setItem("SpCode", data.SpCode);
        alert(`Space created successfully: ${data.SpCode}. Please copy the code.`);
        navigator.clipboard.writeText(data.SpCode);
        navigate(`/space/${data.SpCode}`);
      } else {
        console.error("Error creating space:", data.error);
        alert("Error creating space, please try again.");
      }
    } catch (error) {
      alert("Error creating space, please try again.");
      console.error("Error creating space:", error);
    }
  };

  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = newSpaceName.length > 13 ? 5 : 18 - newSpaceName.length;
    let result = newSpaceName.replace(/\s+/g, "_");
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setNewSpaceCode(result);
  };

  return (
    <div className="enter-code-container">
      <div className="enter-box">
        <h2>Enter Space Code</h2>
        <input
          type="text"
          placeholder="Enter your space code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn-primary" onClick={handleEnter}>
          Enter
        </button>

        <h3>Create a New Space</h3>
        <input
          type="text"
          placeholder="New Space Name"
          value={newSpaceName}
          onChange={(e) => setNewSpaceName(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="text"
            placeholder="New Space Code"
            value={newSpaceCode}
            readOnly
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(newSpaceCode);
              alert("Code copied to clipboard!");
            }}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <img src={copy} height={30} width={30} alt="Copy Icon" />
          </button>
        </div>
        <button
          className="btn-secondary"
          onClick={generateCode}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
        >
          <span>Generate Code</span>
          <img src={star} height={20} width={20} alt="Generate Icon" />
        </button>
        <button className="btn-primary" onClick={handleCreateSpace}>
          Create Space
        </button>
      </div>
    </div>
  );
};

export default EnterCode;
