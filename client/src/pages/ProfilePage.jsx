import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";
import PersonalDetails from "../components/ProfilePage/PersonalDetails";
import ProfileSidebar from "../components/ProfilePage/ProfileSidebar";
import UploadedExams from "../components/ProfilePage/UploadedExams";
import FavoriteExams from "../components/ProfilePage/FavoriteExams";

function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("details"); // "details", "uploaded", "favorites"

  return (
    <div className="profile-page">
      <ProfileSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-page-content">
        {selectedTab === "details" && <PersonalDetails />}
        {selectedTab === "uploaded" && <UploadedExams />}
        {selectedTab === "favorites" && <FavoriteExams />}
      </div>
    </div>
  );
}

export default ProfilePage;
