import React, { useState, useEffect, useRef } from "react";
import axiosInstance, { handleError, handleResult } from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.jpg";
import "../styles/NavBar.css";

function NavBar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () =>
    await axiosInstance
      .post("/auth/logout", {})
      .then((res) =>
        handleResult(res, 200, () => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          onLogout();
          alert("התנתקת בהצלחה");
          navigate("/login");
        })
      )
      .catch((err) => handleError(err, () => console.error(err.response.data.message)));

  return (
    <div className="navbar-container">
      <div
        className="navbar-logo"
        onClick={() => {
          setShowUserMenu(false);
          navigate("/");
        }}
      >
        QWiz
      </div>
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
              navigate("/profile");
              setShowUserMenu(false);
            }}
          >
            הפרופיל שלי
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
