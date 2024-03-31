import React from "react";
import NavBar from "../components/NavBar/NavBar";
import "../styles/HomePage.css";

function HomePage({ onLogout }) {
  return (
    <div className="qwiz-div">
      <NavBar onLogout={onLogout} />
      {/* <h1>ברוכים הבאים לQwiz!</h1> */}
    </div>
  );
}

export default HomePage;
