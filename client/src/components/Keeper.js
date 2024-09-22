import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { ColorRing } from "react-loader-spinner";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";

// Set the base URL for the API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Keeper = () => {
  const { user, setUser } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Fetch token and user once when the component mounts
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedToken, storedUser);
    if (storedToken) {
      setToken(storedToken);
      // Set the stored user to persist username after reload
      if (storedUser) {
        setUser(storedUser);
      }
    } else {
      setError("Authentication failed. Please log in again.");
    }
  }, [setUser]);

  useEffect(() => {
    // Fetch notes only if token is available
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const notesResponse = await getNotes(token);
        setNotes(notesResponse.data);
      } catch (error) {
        setError("Failed to fetch data. Please reload the browser.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const getNotes = async (authToken) => {
    try {
      const response = await api.get("/todos", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response;
    } catch (error) {
      setError("Failed to get the notes. Please reload the browser.");
      console.error("Error getting notes:", error);
      throw error;
    }
  };

  const handleAddNote = async (newNote) => {
    if (!newNote.title || !newNote.content) {
      alert("Please enter both a title and content for the note!");
      return;
    }

    try {
      const response = await api.post("/todos", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data]);
    } catch (error) {
      setError("Failed to add the note. Please reload the browser.");
      console.error("Error creating note:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setNotes((prevNotes) =>
        prevNotes.filter((noteItem) => noteItem._id !== id)
      );
    } catch (error) {
      setError("Failed to delete the note. Please reload the browser.");
      console.error("Error deleting the note:", error);
    }
  };

  const handleSave = async (id, newTitle, newContent, status) => {
    try {
      const response = await api.put(`/todos/${id}`, {
        title: newTitle,
        content: newContent,
        status: status,
      });

      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? response.data : noteItem
        )
      );
    } catch (error) {
      setError("Failed to update the note. Please reload the browser.");
      console.error("Error updating the note:", error);
    }
  };

  const handleCheck = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "incomplete" ? "complete" : "incomplete";
      await api.put(`/todos/${id}`, { status: newStatus });

      setNotes((prevNotes) =>
        prevNotes.map((noteItem) =>
          noteItem._id === id ? { ...noteItem, status: newStatus } : noteItem
        )
      );
    } catch (error) {
      setError("Failed to update the note status. Please try again.");
      console.error("Error updating note status:", error);
    }
  };

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div className="loader-container">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <>
          <h2 className="heading">
            {user ? `Welcome, ${user.username}!` : "Username Loading..."}
          </h2>

          {error && <p className="error-message">{error}</p>}
          <CreateArea onAdd={handleAddNote} />
          {notes.map((noteItem, id) => (
            <Note
              key={id}
              id={noteItem._id}
              title={noteItem.title}
              content={noteItem.content}
              status={noteItem.status}
              onDelete={handleDeleteNote}
              onSave={handleSave}
              onCheck={handleCheck}
            />
          ))}
        </>
      )}
      <Footer />
    </div>
  );
};

export default Keeper;
