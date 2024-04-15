import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ExamDetails from "./ExamDetails";
import ExamForum from "./ExamForum";
import "./ExamPage.css";

function ExamPage() {
  const { examId, tab } = useParams();
  if (!tab) window.location.replace(`/exam/${examId}/details`);

  return tab ? (
    <div className="exam-page">
      <div className="exam-container">
        <div className="exam-container-tabs">
          <a
            className={`exam-container-tab ${tab === "details" ? "chosen" : ""}`}
            id="details-tab"
            onClick={() => window.location.replace(`/exam/${examId}/details`)}
          >
            פרטי הבחינה
          </a>
          <a
            className={`exam-container-tab ${tab === "forum" ? "chosen" : ""}`}
            id="forum-tab"
            onClick={() => window.location.replace(`/exam/${examId}/forum`)}
          >
            פורום
          </a>
        </div>
        {tab === "details" ? <ExamDetails examId={examId} /> : <ExamForum examId={examId} />}
      </div>
    </div>
  ) : null;
}

export default ExamPage;
