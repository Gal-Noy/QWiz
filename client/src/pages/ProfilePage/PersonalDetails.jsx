import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { toast } from "react-custom-alert";

/**
 * The personal details component.
 *
 * @component
 * @returns {JSX.Element} The rendered PersonalDetails component.
 */
function PersonalDetails() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    password: "", // password is not changed in this component
    phone_number: user.phone_number || "",
    id_number: user.id_number || "",
  });
  const [isPending, setIsPending] = useState(false);

  /**
   * Saves the changes made to the user's details.
   *
   * @async
   * @function saveChanges
   * @returns {Promise<void>} The result of saving the changes.
   */
  const saveChanges = async () => {
    if (isPending) return;

    if (!editedUser.name || !editedUser.email) {
      toast.warning("אנא מלא/י את השדות שם מלא ודואר אלקטרוני");
      return;
    }

    if (
      editedUser.name === user.name &&
      editedUser.email === user.email &&
      editedUser.phone_number === (user.phone_number || "") &&
      editedUser.id_number === (user.id_number || "")
    ) {
      setEditMode(false);
      return;
    }

    setIsPending(true);

    await axiosInstance
      .put(`/users/${user._id}`, editedUser)
      .then((res) =>
        handleResult(res, 200, () => {
          const updatedUser = res.data;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setEditedUser({
            ...updatedUser,
            password: "",
            phone_number: updatedUser.phone_number || "",
            id_number: updatedUser.id_number || "",
          });
          toast.success("הפרטים עודכנו בהצלחה");
        })
      )
      .catch((err) =>
        handleError(err, null, () => {
          setEditedUser({
            ...user,
            password: "",
            phone_number: user.phone_number || "",
            id_number: user.id_number || "",
          });
        })
      )
      .finally(() => {
        setIsPending(false);
        setEditMode(false);
      });
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
          {editMode ? isPending ? <div className="lds-dual-ring" id="personal-details-loading"></div> : "שמור" : "ערוך"}
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
