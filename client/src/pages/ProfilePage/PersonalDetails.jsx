import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
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
    name: user.name,
    email: user.email,
    phone_number: user.phone_number || "",
    id_number: user.id_number || "",
  });
  const [isPending, setIsPending] = useState(false);

  // Change password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordPending, setNewPasswordPending] = useState(false);

  /**
   * Saves the changes made to the user's details.
   *
   * @async
   * @function saveChanges
   * @returns {Promise<void>} The result of saving the changes.
   */
  const saveChanges = async () => {
    if (isPending) return;

    if (!editedUser.name || !editedUser.email) return toast.warning("אנא מלא/י את השדות שם מלא ודואר אלקטרוני");

    if (
      editedUser.name === user.name &&
      editedUser.email === user.email &&
      editedUser.phone_number === (user.phone_number || "") &&
      editedUser.id_number === (user.id_number || "")
    )
      return setEditMode(false);

    setIsPending(true);

    // Update the user's details
    await axiosInstance
      .put(`/users/${user._id}`, editedUser)
      .then((res) =>
        handleResult(res, 200, () => {
          const updatedUser = res.data;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setEditedUser({
            name: updatedUser.name,
            email: updatedUser.email,
            phone_number: updatedUser.phone_number || "",
            id_number: updatedUser.id_number || "",
          });
          toast.success("הפרטים עודכנו בהצלחה");
        })
      )
      .catch((err) =>
        handleError(err, null, () => {
          // Reset the edited user to the current user's details
          setEditedUser({
            name: user.name,
            email: user.email,
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

  const changePassword = async () => {
    if (!newPassword) return toast.warning("אנא הכנס/י סיסמה חדשה");
    if (newPassword.length < 6) return toast.warning("הסיסמה חייבת להיות באורך של לפחות 6 תווים");
    if (newPassword !== confirmNewPassword) return toast.warning("הסיסמאות אינן תואמות");

    if (newPasswordPending) return;

    setNewPasswordPending(true);

    await axiosInstance
      .put(`/users/${user._id}`, { password: newPassword })
      .then((res) => handleResult(res, 200, () => toast.success("הסיסמה שונתה בהצלחה")))
      .catch((err) => handleError(err, null))
      .finally(() => {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewPasswordPending(false);
        setShowChangePassword(false);
      });
  };

  return (
    <div className="profile-page-details">
      <div className="profile-page-details-avatar">
        <img src={defaultAvatar} alt="avatar" />
      </div>
      <div className="profile-page-details-items">
        {!showChangePassword ? (
          <>
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
          </>
        ) : (
          <>
            <div className="profile-page-details-item">
              <span className="material-symbols-outlined details-icon">password</span>
              <input
                className="page-details-detail-input"
                type="text"
                placeholder="סיסמה חדשה"
                value={"●".repeat(newPassword.length)}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="profile-page-details-item">
              <span className="material-symbols-outlined details-icon">password</span>
              <input
                className="page-details-detail-input"
                type="text"
                placeholder="אימות סיסמה חדשה"
                value={"●".repeat(confirmNewPassword.length)}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      <div className="profile-page-details-buttons">
        {!showChangePassword ? (
          <>
            <button
              className="profile-page-details-button"
              onClick={() => {
                if (editMode) saveChanges();
                else setEditMode(!editMode);
              }}
            >
              {editMode ? (
                isPending ? (
                  <div className="lds-dual-ring" id="personal-details-loading"></div>
                ) : (
                  "שמור"
                )
              ) : (
                "ערוך"
              )}
            </button>
            {editMode && (
              <button
                className="profile-page-details-button"
                onClick={() => {
                  setEditMode(false);
                  setEditedUser({
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number || "",
                    id_number: user.id_number || "",
                  });
                }}
              >
                בטל
              </button>
            )}
          </>
        ) : (
          <button className="profile-page-details-button" onClick={changePassword}>
            {newPasswordPending ? <div className="lds-dual-ring" id="personal-details-loading"></div> : "שנה סיסמה"}
          </button>
        )}
      </div>
      <button
        className="profile-page-details-change-password-button"
        onClick={() => setShowChangePassword(!showChangePassword)}
      >
        {showChangePassword ? "חזרה לפרטים אישיים" : "שינוי סיסמה"}
      </button>
    </div>
  );
}

export default PersonalDetails;
