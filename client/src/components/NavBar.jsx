import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.jpg";
import "../styles/NavBar.css";

function NavBar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          onLogout();
          alert("התנתקת בהצלחה");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="navbar-container">
      <div className="navbar-logo">QWiz</div>
      <div className="navbar-profile">
        <img
          className={"avatar-pic" + (showUserMenu ? " active" : "")}
          src={defaultAvatar}
          alt="profile"
          onClick={() => setShowUserMenu(!showUserMenu)}
        />
        <label className="hello-user-navbar-label">{user.name}</label>
      </div>
      {showUserMenu && (
        <div className="user-menu">
          <button
            className="user-menu-item"
            onClick={() => {
              console.log("TODO");
            }}
          >
            הפרופיל שלי
          </button>
          <button
            className="user-menu-item"
            onClick={() => {
              console.log("TODO");
            }}
          >
            המבחנים שלי
          </button>
          <button className="user-menu-item" onClick={handleLogout}>
            התנתק
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;
