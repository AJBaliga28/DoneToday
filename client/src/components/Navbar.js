import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegStickyNote } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = ({ onSearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("You have successfully logged out.");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <h2>
        <Link to="/">
          <FaRegStickyNote size={"1.25em"} className="home-btn" />
        </Link>
      </h2>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <div className="dropdown">
              <Link to="#" className="login-btn" onClick={handleLogout}>
                <FiLogIn size={"2em"} />
              </Link>
            </div>
          </>
        ) : (
          <Link to="/login">
            <MdAccountCircle size={"1.25em"} className="acc-btn" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
