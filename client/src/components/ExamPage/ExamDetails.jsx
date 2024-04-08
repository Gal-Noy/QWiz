import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import ExamRating from "../ExamRating";
import "../../styles/ExamDetails.css";

function ExamDetails({ examId }) {
  const [exam, setExam] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [filePath, setFilePath] = useState(null);
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
          setError("שגיאה בטעינת פרטי הבחינה, אנא נסה שנית.");
        });
      });
  }, [examId]);

  useEffect(() => {
    if (exam) {
      axiosInstance
        .get(`/exams/${exam._id}/presigned`)
        .then((res) => handleResult(res, 200, () => setFilePath(res.data.presignedUrl)))
        .catch((err) => {
          handleError(err, () => {
            console.error(err.response.data.message);
          });
        });
    }
  }, [exam]);

  const goToPdf = () => {
    window.open(filePath, "_blank");
  };

  return (
    <div className="exam-details">
      {isPending && <div className="loading-exam">טוען פרטי בחינה...</div>}
      {error && <div className="error-exam">{error}</div>}
      {!isPending && exam && (
        <>
          <div className="exam-details-right-section">
            <div className="exam-details-items">
              <div className="exam-details-item">
                <a className="exam-details-item-header">שם הקורס:</a>
                <a className="exam-details-item-text">{exam.course.name}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">קוד קורס:</a>
                <a className="exam-details-item-text">{exam.course.code}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">מחלקה:</a>
                <a className="exam-details-item-text">{exam.department.name}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">פקולטה:</a>
                <a className="exam-details-item-text">{exam.department.faculty.name}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">ציון:</a>
                <a className="exam-details-item-text">{exam.grade}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">סמסטר:</a>
                <a className="exam-details-item-text">
                  {exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "קיץ"}
                </a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">מועד:</a>
                <a className="exam-details-item-text">
                  {exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}
                </a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">שנה:</a>
                <a className="exam-details-item-text">{exam.year}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">סוג בחינה:</a>
                <a className="exam-details-item-text">{exam.semester === "quiz" ? "בוחן" : "מבחן"}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">מרצים:</a>
                <a className="exam-details-item-text">{exam.lecturers}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">דירוג קושי:</a>
                <ExamRating difficultyRating={exam.difficultyRating} examId={exam._id} editMode={false} />
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">הועלה על ידי:</a>
                <a className="exam-details-item-text">{exam.uploadedBy.name}</a>
              </div>
            </div>
          </div>
          <div className="exam-details-left-section">
            <div className="exam-details-pdf" onClick={goToPdf}>
              <Document file={filePath}>
                <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>
            <ExamRating difficultyRating={exam.difficultyRating} examId={exam._id} editMode={true} setExam={setExam} />
          </div>
        </>
      )}
    </div>
  );
}

export default ExamDetails;
