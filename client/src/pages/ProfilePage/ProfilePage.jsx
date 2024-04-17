import React from "react";
import { useParams } from "react-router-dom";
import PersonalDetails from "./PersonalDetails";
import ProfileSidebar from "./ProfileSidebar";
import UploadedExams from "./UploadedExams";
import FavoriteExams from "./FavoriteExams";
import CreatedThreads from "./CreatedThreads";
import StarredThreads from "./StarredThreads";
import "./ProfilePage.css";

/**
 * The profile page component.
 *
 * @component
 * @returns {JSX.Element} The rendered ProfilePage component.
 */
function ProfilePage() {
  const { tab } = useParams();

  return (
    <div className="profile-page">
      <ProfileSidebar tab={tab} />
      <div className="profile-page-content">
        {tab === "personal-details" && <PersonalDetails />}
        {tab === "uploaded-exams" && <UploadedExams />}
        {tab === "favorite-exams" && <FavoriteExams />}
        {tab === "created-threads" && <CreatedThreads />}
        {tab === "starred-threads" && <StarredThreads />}
      </div>
    </div>
  );
}

export default ProfilePage;
