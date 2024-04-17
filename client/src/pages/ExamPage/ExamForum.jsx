import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
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
  const [threads, setThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the threads of the exam.
   *
   * @async
   * @function fetchThreads
   * @returns {Promise<void>} The result of the threads fetch.
   */
  const fetchThreads = async () => {
    setIsPending(true);
    await axiosInstance
      .get(`threads/exam/${examId}`)
      .then((res) => handleResult(res, 200, () => setThreads(res.data)))
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הדיונים, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  useEffect(() => fetchThreads(), [examId]); // Initial fetch

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
      <ThreadsList threads={threads} setThreads={setThreads} isPending={isPending} error={error} />
    </div>
  );
}

export default ExamForum;
