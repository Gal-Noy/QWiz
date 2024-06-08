import React from "react";
import { useParams } from "react-router-dom";
import PersonalDetails from "./PersonalDetails";
import ProfileSidebar from "./ProfileSidebar";
import ExamsList from "../../components/ExamsList/ExamsList";
import ThreadsList from "../../components/ThreadsList/ThreadsList";
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
        {tab === "uploaded-exams" && (
          <ExamsList
            query={`/exams?uploadedBy=${JSON.parse(localStorage.getItem("user"))._id}`}
            showExams={true}
            isProfilePage={true}
          />
        )}
        {tab === "favorite-exams" && (
          <ExamsList query={`/exams?favoritesOnly=true`} showExams={true} isProfilePage={true} />
        )}
        {tab === "created-threads" && (
          <ThreadsList
            query={`/threads?creator=${JSON.parse(localStorage.getItem("user"))._id}`}
            isProfilePage={true}
          />
        )}
        {tab === "starred-threads" && <ThreadsList query={`/threads?starredOnly=true`} isProfilePage={true} />}
      </div>
    </div>
  );
}

export default ProfilePage;
