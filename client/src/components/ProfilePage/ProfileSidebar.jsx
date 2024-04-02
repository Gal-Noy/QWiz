import React from "react";
import "../../styles/ProfilePage.css";

function ProfileSidebar({ selectedTab, setSelectedTab }) {
  return (
    <div className="profile-page-sidebar">
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "details" ? " active" : "")}
        onClick={() => setSelectedTab("details")}
      >
        <span className="material-symbols-outlined sidebar-icon">person</span>
        פרטים אישיים
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "uploaded" ? " active" : "")}
        onClick={() => setSelectedTab("uploaded")}
      >
        <span className="material-symbols-outlined sidebar-icon">cloud_upload</span>
        מבחנים שהעליתי
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "favorites" ? " active" : "")}
        onClick={() => setSelectedTab("favorites")}
      >
        <span className="material-symbols-outlined sidebar-icon">star</span>
        מבחנים מועדפים
      </div>
    </div>
  );
}

export default ProfileSidebar;
