import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaMoon, FaSun } from "react-icons/fa";
import "../App.css";
import PropTypes from "prop-types";
import {useSpace} from "../contexts/SpaceContext";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {user} = useSpace();
  const {spCode} = useSpace();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      spCode ? navigate(`/space/${spCode}`) : navigate("/enter-code");
    }
  }, [user, spCode, navigate]);
  

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, [auth, setIsAuthenticated]);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setErrorMessage("Please verify your email before logging in.");
        return;
      }
      setIsAuthenticated(true);
      navigate("/enter-code");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthenticated(true);
      navigate("/enter-code");
    } catch (error) {
      setErrorMessage("Google login failed. Please try again.");
      console.error("Google login failed:", error);
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setErrorMessage("Registration successful. Verify your email before logging in.");
      setIsRegistering(false);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        setErrorMessage("Email already in use. Try logging in.");
        break;
      case "auth/wrong-password":
        setErrorMessage("Incorrect password.");
        break;
      case "auth/network-request-failed":
        setErrorMessage("Network error. Check your connection.");
        break;
      default:
        setErrorMessage("An error occurred. Try again.");
    }
  };

  return (
    <>
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {isRegistering ? (
        <div className="auth-box">
          <h2>Register</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && <p className="error-message" style={{color:"red"}}>{errorMessage}</p>}
          <button onClick={handleRegister}>Register</button>
          <button className="google-btn" style={{ marginRight: "0.5rem" }} onClick={handleGoogleLogin}>
            <FaGoogle /> Register with Google
          </button>
          <p>Already have an account? <button onClick={() => setIsRegistering(false)}>Login</button></p>
        </div>
      ) : (
        <div className="auth-box">
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && <p className="error-message" style={{color:"red"}}>{errorMessage}</p>}
          <button onClick={handleEmailLogin}>Login</button>
          <button className="google-btn" style={{ marginRight: "0.5rem" }} onClick={handleGoogleLogin}>
            <FaGoogle /> Login with Google
          </button>
          <p>Don&apos;t have an account? <button onClick={() => setIsRegistering(true)}>Register</button></p>
        </div>
      )}
    </div>
    </>
  );
}
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
