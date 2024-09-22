// Signup.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ensure correct import path
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Common.css";

const Signup = () => {
  const { signup } = useContext(AuthContext); // This should not be undefined
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (state.password !== state.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      console.log(state);
      await signup(state);

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("User already exists");
      } else {
        setErrorMessage("Error when signing up.");
      }
      console.error("There was an error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="heading">Sign up!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleInputChange}
            placeholder="Enter your username: "
            required
          />
        </div>
        <div className="form-control">
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            placeholder="Enter your email: "
            required
          />
        </div>
        <div className="form-control">
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
            placeholder="Enter your password: "
            required
          />
        </div>
        <div className="form-control">
          <label>Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm the password: "
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="submit-btn" type="submit" disabled={isLoading}>
          <FaArrowRight />
        </button>
      </form>
      <p className="connecting-para">
        Have an account? <a href="/login">Log In!</a>
      </p>
    </div>
  );
};

export default Signup;
