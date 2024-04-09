import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import PersonalDetails from "./PersonalDetails";
import ProfileSidebar from "./ProfileSidebar";
import UploadedExams from "./UploadedExams";
import FavoriteExams from "./FavoriteExams";
import CreatedThreads from "./CreatedThreads";
import StarredThreads from "./StarredThreads";

function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("personal-details"); // "personal-details", "uploaded-exams", "favorite-exams", "created-threads", "starred-threads"

  return (
    <div className="profile-page">
      <ProfileSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-page-content">
        {selectedTab === "personal-details" && <PersonalDetails />}
        {selectedTab === "uploaded-exams" && <UploadedExams />}
        {selectedTab === "favorite-exams" && <FavoriteExams />}
        {selectedTab === "created-threads" && <CreatedThreads />}
        {selectedTab === "starred-threads" && <StarredThreads />}
      </div>
    </div>
  );
}

export default ProfilePage;
