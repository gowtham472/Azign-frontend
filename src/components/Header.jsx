import { Link, useNavigate } from "react-router-dom";
import { useSpace } from "../contexts/SpaceContext"; // Use your Space Context
import { getAuth } from "firebase/auth";
import logo from "../assets/logo.jpg";
import "../App.css";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useSpace(); // Get user state

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      localStorage.removeItem("SpCode");
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} className="logoimg" alt="Azign Logo" />
        <h1 className="logotxt">Azign</h1>
      </div>
      <div className="auth-buttons">
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}
