import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import "../../styles/ProfilePage.css";

function PersonalDetails({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user, password: "••••••••" });

  const saveChanges = () => {};

  return (
    <div className="profile-page-details">
      <div className="profile-page-details-avatar">
        <img src={defaultAvatar} alt="avatar" />
      </div>
      <div className="profile-page-details-items">
        <div className="profile-page-details-item">
          <span class="material-symbols-outlined details-icon">person</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="text"
              placeholder="שם מלא"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">{user.name}</label>
          )}
        </div>
        <div className="profile-page-details-item">
          <span class="material-symbols-outlined details-icon">email</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="email"
              placeholder="דואר אלקטרוני"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">{user.email}</label>
          )}
        </div>
        <div className="profile-page-details-item">
          <span class="material-symbols-outlined details-icon">key</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="password"
              placeholder="סיסמה"
              value={editedUser.password}
              onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">••••••••</label>
          )}
        </div>
        <div className="profile-page-details-item">
          <span class="material-symbols-outlined details-icon">phone_iphone</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="tel"
              placeholder={editedUser.phone_number || "טלפון"}
              value={editedUser.phone_number}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">{user.phone_number || ""}</label>
          )}
        </div>
        <div className="profile-page-details-item">
          <span class="material-symbols-outlined details-icon">id_card</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="text"
              placeholder={editedUser.id_number || "תעודת זהות"}
              value={editedUser.id_number}
              onChange={(e) => setEditedUser({ ...editedUser, id: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">{user.id_number || ""}</label>
          )}
        </div>
      </div>
      <div className="profile-page-details-buttons">
        <button
          className="profile-page-details-button"
          onClick={() => {
            if (editMode) saveChanges();
            setEditMode(!editMode);
          }}
        >
          {editMode ? "שמור" : "ערוך"}
        </button>
        {editMode && (
          <button
            className="profile-page-details-button"
            onClick={() => {
              setEditMode(false);
              setEditedUser({ ...user, password: "••••••••" });
            }}
          >
            בטל
          </button>
        )}
      </div>
    </div>
  );
}

export default PersonalDetails;
