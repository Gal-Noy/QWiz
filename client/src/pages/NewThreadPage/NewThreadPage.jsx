import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import ContentArea from "../../components/ContentArea/ContentArea";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { examToString } from "../../utils/generalUtils";
import "./NewThreadPage.css";

function NewThread() {
  const { examId } = useParams();
  const [examDetailsValue, setExamDetailsValue] = useState("");
  const [threadDetails, setThreadDetails] = useState({
    title: "",
    exam: examId,
    tags: [],
  });
  const [threadContent, setThreadContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/exams/${examId}`)
      .then((res) => handleResult(res, 200, () => setExamDetailsValue(examToString(res.data))))
      .catch((err) => handleError(err, () => console.log("Failed to fetch exam details")));
  }, [examId]);

  const createNewThread = async () => {
    if (!threadDetails.title || !threadContent) {
      alert("אנא מלא/י כותרת ותוכן");
      return;
    }
    for (const tag of threadDetails.tags) {
      if (tag.includes(" ")) {
        alert("אנא הכנס/י תגיות מופרדות בפסיק ללא רווחים");
        return;
      }
    }

    setIsPending(true);

    const newThread = {
      title: threadDetails.title,
      content: threadContent,
      exam: examId,
      tags: [...new Set(threadDetails.tags)],
    };

    await axiosInstance
      .post("/threads", newThread)
      .then((res) =>
        handleResult(res, 201, () => {
          alert("הדיון נוצר בהצלחה");
          window.location.href = `/thread/${res.data._id}`;
        })
      )
      .then(() => setIsPending(false))
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
          <ContentArea content={threadContent} setContent={setThreadContent} />
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
            {isPending ? <div className="lds-dual-ring"/> : "צור דיון"}
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
