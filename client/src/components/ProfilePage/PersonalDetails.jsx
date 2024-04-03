import React, { useState } from "react";
import { handleError } from "../../utils/axiosUtils";
import axios from "axios";
import defaultAvatar from "../../assets/default-avatar.jpg";
import "../../styles/ProfilePage.css";

function PersonalDetails() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    password: "", // password is not changed in this component
    phone_number: user.phone_number || "",
    id_number: user.id_number || "",
  });

  const saveChanges = () => {
    if (!editedUser.name || !editedUser.email) {
      alert("אנא מלא/י את השדות שם מלא ודואר אלקטרוני");
      return;
    }
    axios
      .put(`${import.meta.env.VITE_SERVER_URL}/users/${user._id}`, editedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data));
          setEditedUser({
            ...res.data,
            password: "",
            phone_number: res.data.phone_number || "",
            id_number: res.data.id_number || "",
          });
          alert("הפרטים עודכנו בהצלחה");
        }
      })
      .then(() => setEditMode(false))
      .catch((err) =>
        handleError(err, () => {
          alert("שגיאה בעדכון הפרטים, אנא נסה שנית");
        })
      );
  };

  return (
    <div className="profile-page-details">
      <div className="profile-page-details-avatar">
        <img src={defaultAvatar} alt="avatar" />
      </div>
      <div className="profile-page-details-items">
        <div className="profile-page-details-item">
          <span className="material-symbols-outlined details-icon">person</span>
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
          <span className="material-symbols-outlined details-icon">email</span>
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
          <span className="material-symbols-outlined details-icon">phone_iphone</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="tel"
              placeholder="טלפון"
              value={editedUser.phone_number || ""}
              onChange={(e) => setEditedUser({ ...editedUser, phone_number: e.target.value })}
            />
          ) : (
            <label className="page-details-detail-data">{user.phone_number || ""}</label>
          )}
        </div>
        <div className="profile-page-details-item">
          <span className="material-symbols-outlined details-icon">id_card</span>
          {editMode ? (
            <input
              className="page-details-detail-input"
              type="text"
              placeholder="תעודת זהות"
              value={editedUser.id_number || ""}
              onChange={(e) => setEditedUser({ ...editedUser, id_number: e.target.value })}
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
            else setEditMode(!editMode);
          }}
        >
          {editMode ? "שמור" : "ערוך"}
        </button>
        {editMode && (
          <button
            className="profile-page-details-button"
            onClick={() => {
              setEditMode(false);
              setEditedUser({
                ...user,
                password: "",
                phone_number: user.phone_number || "",
                id_number: user.id_number || "",
              });
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
