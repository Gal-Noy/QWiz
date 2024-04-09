import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";
import "./ExamForum.css";

function ExamForum({ examId }) {
  const [threads, setThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPending(true);
    axiosInstance
      .get(`threads/exam/${examId}`)
      .then((res) => handleResult(res, 200, () => setThreads(res.data)))
      .then(() => setIsPending(false))
      .catch((err) =>
        handleError(err, () => {
          console.error(err.response.data.message);
          setError("שגיאה בטעינת הדיונים, אנא נסה שנית.");
          setIsPending(false);
        })
      );
  }, [examId]);

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
