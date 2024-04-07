import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../utils/axiosInstance";
import ExamDetails from "../components/ExamPage/ExamDetails";
import ExamForum from "../components/ExamPage/ExamForum";
import "../styles/ExamPage.css";

function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [tabChosen, setTabChosen] = useState("details"); // "details" or "forum"
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/exams/${examId}`)
      .then((res) => handleResult(res, 200, () => setExam(res.data)))
      .then(() => {
        setIsPending(false);
      })
      .catch((err) => {
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בטעינת הבחינה, אנא נסה שנית.");
          navigate("/");
        });
      });
  }, [examId]);

  return (
    <div className="exam-page">
      <div className="exam-container">
        {isPending && <a className="loading-exam">טוען מבחן...</a>}
        {!isPending && exam && (
          <React.Fragment>
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
            {tabChosen === "details" ? <ExamDetails exam={exam} setExam={setExam} /> : <ExamForum />}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default ExamPage;
