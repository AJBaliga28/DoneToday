// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(); // Ensure this matches the import in other files

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/users",
  headers: { "Content-Type": "application/json" },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await api.post("users/login", credentials);

      // Check if response is in JSON format and has expected fields
      if (response.headers["content-type"]?.includes("application/json")) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ username }));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser({ username });
        setIsAuthenticated(true);
      } else {
        throw new Error("Unexpected server response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Check if the error is from the server
      if (error.response) {
        throw new Error(
          error.response.data.message || "Invalid email or password"
        );
      } else {
        throw new Error("Network error or unexpected server response");
      }
    }
  };

  const signup = async (data) => {
    try {
      const response = await api.post("users/signup", data);

      // Check if response is in JSON format and has expected fields
      if (response.headers["content-type"]?.includes("application/json")) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Unexpected server response format");
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Check if the error is from the server
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error when signing up."
        );
      } else {
        throw new Error("Network error or unexpected server response");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let storedUser = null;
    try {
      const storedUserString = localStorage.getItem("user");
      if (storedUserString) {
        storedUser = JSON.parse(storedUserString);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user"); // Remove invalid data
    }

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
