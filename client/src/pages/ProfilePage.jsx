import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/ProfilePage.css";
import PageHeader from "../components/PageHeader";
import PersonalDetails from "../components/ProfilePage/PersonalDetails";
import ProfileSidebar from "../components/ProfilePage/ProfileSidebar";

function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("details"); // ["details", "uploaded", "favorites"
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-page">
      <ProfileSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="profile-page-content">{selectedTab === "details" && <PersonalDetails />}</div>
    </div>
  );
}

export default ProfilePage;
