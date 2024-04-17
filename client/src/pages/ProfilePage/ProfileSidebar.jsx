import React from "react";

/**
 * The profile sidebar component.
 *
 * @component
 * @param {Object} props The component props.
 * @param {string} props.tab The current tab.
 * @returns {JSX.Element} The rendered ProfileSidebar component.
 */
function ProfileSidebar({ tab }) {
  const setTab = (tab) => {
    window.location.href = `/profile/${tab}`;
  };

  return (
    <div className="profile-page-sidebar">
      <div
        className={"profile-page-sidebar-item" + (tab === "personal-details" ? " active" : "")}
        onClick={() => setTab("personal-details")}
      >
        <span className="material-symbols-outlined sidebar-icon">person</span>
        פרטים אישיים
      </div>
      <div
        className={"profile-page-sidebar-item" + (tab === "uploaded-exams" ? " active" : "")}
        onClick={() => setTab("uploaded-exams")}
      >
        <span className="material-symbols-outlined sidebar-icon">cloud_upload</span>
        מבחנים שהעליתי
      </div>
      <div
        className={"profile-page-sidebar-item" + (tab === "favorite-exams" ? " active" : "")}
        onClick={() => setTab("favorite-exams")}
      >
        <span className="material-symbols-outlined sidebar-icon">star</span>
        מבחנים מועדפים
      </div>
      <div
        className={"profile-page-sidebar-item" + (tab === "created-threads" ? " active" : "")}
        onClick={() => setTab("created-threads")}
      >
        <span className="material-symbols-outlined sidebar-icon">forum</span>
        דיונים שיצרתי
      </div>
      <div
        className={"profile-page-sidebar-item" + (tab === "starred-threads" ? " active" : "")}
        onClick={() => setTab("starred-threads")}
      >
        <span className="material-symbols-outlined sidebar-icon">star</span>
        דיונים מועדפים
      </div>
    </div>
  );
}

export default ProfileSidebar;
