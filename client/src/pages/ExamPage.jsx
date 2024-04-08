import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ExamDetails from "../components/ExamPage/ExamDetails";
import ExamForum from "../components/ExamForum/ExamForum";
import "../styles/ExamPage.css";

function ExamPage() {
  const { examId } = useParams();
  const [tabChosen, setTabChosen] = useState("details"); // "details" or "forum"

  return (
    <div className="exam-page">
      <div className="exam-container">
        <div className="exam-container-tabs">
          <a
            className={`exam-container-tab ${tabChosen === "details" ? "chosen" : ""}`}
            id="details-tab"
            onClick={() => setTabChosen("details")}
          >
            פרטי הבחינה
          </a>
          <a
            className={`exam-container-tab ${tabChosen === "forum" ? "chosen" : ""}`}
            id="forum-tab"
            onClick={() => setTabChosen("forum")}
          >
            פורום
          </a>
        </div>
        {tabChosen === "details" ? <ExamDetails examId={examId} /> : <ExamForum examId={examId} />}
      </div>
    </div>
  );
}

export default ExamPage;
