import React from "react";

function ProfileSidebar({ selectedTab, setSelectedTab }) {
  return (
    <div className="profile-page-sidebar">
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "personal-details" ? " active" : "")}
        onClick={() => setSelectedTab("personal-details")}
      >
        <span className="material-symbols-outlined sidebar-icon">person</span>
        פרטים אישיים
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "uploaded-exams" ? " active" : "")}
        onClick={() => setSelectedTab("uploaded-exams")}
      >
        <span className="material-symbols-outlined sidebar-icon">cloud_upload</span>
        מבחנים שהעליתי
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "favorite-exams" ? " active" : "")}
        onClick={() => setSelectedTab("favorite-exams")}
      >
        <span className="material-symbols-outlined sidebar-icon">star</span>
        מבחנים מועדפים
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "created-threads" ? " active" : "")}
        onClick={() => setSelectedTab("created-threads")}
      >
        <span className="material-symbols-outlined sidebar-icon">forum</span>
        דיונים שיצרתי
      </div>
      <div
        className={"profile-page-sidebar-item" + (selectedTab === "starred-threads" ? " active" : "")}
        onClick={() => setSelectedTab("starred-threads")}
      >
        <span className="material-symbols-outlined sidebar-icon">star</span>
        דיונים מסומנים בכוכב
      </div>
    </div>
  );
}

export default ProfileSidebar;
