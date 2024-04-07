import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "../../styles/ExamForum.css";

function ExamForum({ exam }) {
  const [threads, setThreads] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);


  return (
    <div className="exam-forum">
      <div className="threads-list">
        <label className="threads-list-count">סה"כ</label>
      </div>
    </div>
  );
}

export default ExamForum;
