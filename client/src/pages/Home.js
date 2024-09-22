// Home.js
import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">DoneToday!</h1>
      <p className="home-para">
        Organize your thoughts and ideas efficiently with our easy-to-use
        note-taking app.
      </p>
      <div className="home-link">
        <a href="/signup">Get Started</a>
      </div>
    </div>
  );
};

export default Home;
