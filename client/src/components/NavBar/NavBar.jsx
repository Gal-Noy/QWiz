import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.jpg";
import "./NavBar.css";

function NavBar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [freeSearchValue, setFreeSearchValue] = useState("");
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

  const freeSearch = () => {
    if (!freeSearchValue) return;
    setShowUserMenu(false);
    setFreeSearchValue("");
    navigate(`/search/${freeSearchValue}`);
  };

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
      <div className="navbar-free-search-div">
        <input
          className="navbar-free-search-input"
          placeholder="חיפוש חופשי - למשל: מבני נתונים 2023 מועד א'"
          value={freeSearchValue}
          onChange={(e) => setFreeSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && freeSearch()}
        />
        <span className="navbar-free-search-button material-symbols-outlined" onClick={freeSearch}>
          search
        </span>
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
