import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";
import PersonalDetails from "../components/ProfilePage/PersonalDetails";
import ProfileSidebar from "../components/ProfilePage/ProfileSidebar";
import UploadedExams from "../components/ProfilePage/UploadedExams";
import FavoriteExams from "../components/ProfilePage/FavoriteExams";
import CreatedThreads from "../components/ProfilePage/CreatedThreads";
import StarredThreads from "../components/ProfilePage/StarredThreads";

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
