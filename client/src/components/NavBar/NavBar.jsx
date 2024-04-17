import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { toast } from "react-custom-alert";
import "./NavBar.css";

/**
 * A navigation bar component.
 *
 * @component
 * @returns {JSX.Element} The rendered NavBar component.
 */
function NavBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [freeSearchValue, setFreeSearchValue] = useState("");
  const [pendingLogout, setPendingLogout] = useState(false);
  const userName = JSON.parse(localStorage.getItem("user")).name;

  /**
   * Handle the logout event.
   *
   * @async
   * @function
   * @returns {void}
   */
  const handleLogout = async () => {
    if (pendingLogout) return;
    setPendingLogout(true);
    await axiosInstance
      .post("/auth/logout", {})
      .then((res) =>
        handleResult(res, 200, () => {
          toast.success("התנתקת בהצלחה");
          setTimeout(() => {
            // Clear the local storage and redirect to the home page
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/home";
          }, 1000);
        })
      )
      .catch((err) => handleError(err, null, () => setPendingLogout(false)));
  };

  /**
   * Handle the free search event.
   *
   * @function
   * @returns {void}
   */
  const freeSearch = () => {
    if (!freeSearchValue) return;
    setShowUserMenu(false);
    setFreeSearchValue("");
    window.location.href = `/search/${freeSearchValue}`;
  };

  return (
    <div className="navbar-container">
      {/* Logo */}
      <div
        className="navbar-logo"
        onClick={() => {
          setShowUserMenu(false);
          window.location.href = "/home";
        }}
      >
        QWiz
      </div>
      {/* Free Search */}
      <div className="navbar-free-search-div">
        <input
          className="navbar-free-search-input"
          placeholder="חיפוש חופשי - למשל: מבני נתונים 2023 מועד א"
          value={freeSearchValue}
          onChange={(e) => setFreeSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && freeSearch()}
        />
        <span className="navbar-free-search-button material-symbols-outlined" onClick={freeSearch}>
          search
        </span>
      </div>
      {/* User Profile */}
      <div className="navbar-profile">
        <img
          className={"avatar-pic" + (showUserMenu ? " active" : "")}
          src={defaultAvatar}
          alt="profile"
          onClick={() => setShowUserMenu(!showUserMenu)}
        />
        <label className="hello-user-navbar-label">{userName}</label>
      </div>
      {/* User Menu */}
      {showUserMenu && (
        <div className="user-menu">
          <button
            className="user-menu-item"
            onClick={() => {
              window.location.href = "/profile";
              setShowUserMenu(false);
            }}
          >
            הפרופיל שלי
          </button>
          <button className="user-menu-item" onClick={handleLogout}>
            {pendingLogout ? <div className="lds-dual-ring" id="logout-loading"></div> : "התנתקות"}
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;
