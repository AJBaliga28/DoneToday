import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/Common.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(state);
      alert("Successfully logged in.");
      navigate("/create");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="heading">Login!</h2>
      <form onSubmit={handleSubmit}>
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="submit-btn" type="submit" disabled={isLoading}>
          <FaArrowRight />
        </button>
      </form>
      <p className="connecting-para">
        Not registered? <a href="/signup">Sign up!</a>
      </p>
    </div>
  );
};

export default Login;
