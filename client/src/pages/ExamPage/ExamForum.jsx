import React from "react";
import ThreadsList from "../../components/ThreadsList/ThreadsList";
import "./ExamForum.css";

/**
 * The exam forum component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.examId - The ID of the exam.
 * @returns {JSX.Element} The rendered ExamForum component.
 */
function ExamForum({ examId }) {

  return (
    <div className="exam-forum">
      <span
        onClick={() => {
          window.location.href = `/exam/${examId}/new-thread`;
        }}
        className="material-symbols-outlined add-thread-button"
      >
        add
      </span>
      <ThreadsList query={`/threads?exam=${examId}`} />
    </div>
  );
}

export default ExamForum;
