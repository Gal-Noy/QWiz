import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../PageHeader";
import ContentArea from "./ContentArea";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "../../styles/NewThread.css";

function NewThread() {
  const { examId } = useParams();
  const [examDetailsValue, setExamDetailsValue] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadTags, setThreadTags] = useState([]);
  const [threadContent, setThreadContent] = useState(""); // first comment

  useEffect(() => {
    axiosInstance
      .get(`/exams/${examId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const { course, type, year, semester, term } = res.data;
          setExamDetailsValue(
            `${course.name} - ${type === "test" ? "מבחן" : "בוחן"} - ${year} - סמסטר ${
              semester === 1 ? "א'" : semester === 2 ? "ב'" : "ג'"
            } - מועד ${term === 1 ? "א'" : term === 2 ? "ב'" : "ג'"}`
          );
        })
      )
      .catch((err) => handleError(err, () => console.log("Failed to fetch exam details")));
  }, [examId]);

  return (
    <div className="new-thread">
      <PageHeader title="הוסף דיון" />
      <div className="new-thread-container">
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="exam-id">
            פרטי הבחינה:
          </label>
          <input className="new-thread-input" type="text" id="exam-id" value={examDetailsValue} disabled />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="title">
            כותרת:
          </label>
          <input
            className="new-thread-input"
            type="text"
            id="title"
            value={threadTitle}
            onChange={(e) => setThreadTitle(e.target.value)}
          />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="content">
            תוכן:
          </label>
          <ContentArea setContent={setThreadContent} />
        </div>
      </div>
    </div>
  );
}

export default NewThread;
