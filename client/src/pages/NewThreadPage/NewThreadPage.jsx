import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import ContentArea from "../../components/ContentArea/ContentArea";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "./NewThreadPage.css";

function NewThread() {
  const { examId } = useParams();
  const [examDetailsValue, setExamDetailsValue] = useState("");
  const [threadDetails, setThreadDetails] = useState({
    title: "",
    content: "",
    exam: examId,
    tags: [],
  });

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

  const createNewThread = () => {
    if (!threadDetails.title || !threadDetails.content) {
      alert("אנא מלא/י כותרת ותוכן");
      return;
    }

    axiosInstance
      .post("/threads", { ...threadDetails, tags: [...new Set(threadDetails.tags)] })
      .then((res) =>
        handleResult(res, 201, () => {
          alert("הדיון נוצר בהצלחה");
          // window.location.href = `/exams/${examId}`;
        })
      )
      .catch((err) => handleError(err, () => alert("יצירת הדיון נכשלה")));
  };

  const cancelNewThread = () => {
    window.location.href = `/exam/${examId}`;
  };

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
            value={threadDetails.title}
            onChange={(e) => setThreadDetails({ ...threadDetails, title: e.target.value })}
          />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="content">
            תוכן:
          </label>
          <ContentArea
            content={threadDetails.content}
            setContent={(content) => setThreadDetails({ ...threadDetails, content })}
          />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="title">
            תגיות:
          </label>
          <input
            className="new-thread-input"
            type="text"
            id="title"
            placeholder="הכנס תגיות מופרדות בפסיק ללא רווחים"
            value={threadDetails.tags.join(",")}
            onChange={(e) => setThreadDetails({ ...threadDetails, tags: e.target.value.split(",") })}
          />
        </div>
        <div className="new-thread-buttons">
          <button className="new-thread-button" onClick={createNewThread}>
            שלח
          </button>
          <button className="new-thread-button" onClick={cancelNewThread}>
            בטל
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewThread;
