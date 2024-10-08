import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { Document, Page, pdfjs } from "react-pdf";
import ExamRating from "../../components/ExamRating/ExamRating";
import "./ExamDetails.css";
import { mapTags } from "../../utils/generalUtils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * The exam details component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.examId - The ID of the exam.
 * @returns {JSX.Element} The rendered ExamDetails component.
 */
function ExamDetails({ examId }) {
  const [exam, setExam] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  /**
   * Fetches the exam details.
   *
   * @async
   * @function fetchExam
   * @returns {Promise<void>} The result of the exam details fetch.
   */
  const fetchExam = async () => {
    if (isPending) return;
    setIsPending(true);
    await axiosInstance
      .get(`/exams/${examId}`)
      .then((res) => handleResult(res, 200, () => setExam(res.data)))
      .then(() => setIsPending(false))
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת פרטי הבחינה, אנא נסה שנית.")));
  };

  /**
   * Fetches the presigned URL of the exam.
   *
   * @async
   * @function getPresignedUrl
   * @returns {Promise<void>} The result of the presigned URL fetch.
   */
  const getPresignedUrl = async () =>
    await axiosInstance
      .get(`/exams/${exam._id}/presigned`)
      .then((res) => handleResult(res, 200, () => setFilePath(res.data.presignedUrl)))
      .catch((err) => handleError(err));

  /**
   * Opens the PDF file in a new tab.
   *
   * @function openPdf
   * @returns {void}
   */
  const openPdf = () => {
    if (!pdfLoaded) return;
    window.open(filePath, "_blank");
  };

  // Initial fetch
  useEffect(() => {
    fetchExam();
  }, [examId]);

  // Fetch the presigned URL after the exam is fetched
  useEffect(() => {
    if (exam) getPresignedUrl();
  }, [exam]);

  return (
    <div className="exam-details">
      {isPending && <div className="lds-dual-ring" id="loading-exam"></div>}
      {!isPending && error && <div className="error-exam">{error}</div>}
      {!isPending && !error && exam && (
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
                <a className="exam-details-item-text">{exam.course.department.name}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">פקולטה:</a>
                <a className="exam-details-item-text">{exam.course.department.faculty.name}</a>
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
                <a className="exam-details-item-header">דירוג קושי:</a>
                <ExamRating exam={exam} editMode={false} />
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">הועלה על ידי:</a>
                <a className="exam-details-item-text">{exam.uploadedBy.name}</a>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">מרצים:</a>
                <div className="exam-details-item-text">
                  {exam.lecturers.map((lecturer, index) => (
                    <span key={index}>
                      <a href={`/search/${lecturer}`}>{lecturer}</a>
                      {index !== exam.lecturers.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
              <div className="exam-details-item">
                <a className="exam-details-item-header">תגיות:</a>
                <div className="exam-details-item-text">{mapTags(exam.tags)}</div>
              </div>
              <a className="exam-details-new-tags-label">ניתן להוסיף תגיות חדשות בעת יצירת דיון חדש בפורום הבחינה.</a>
            </div>
          </div>
          <div className="exam-details-left-section">
            <div className={"exam-details-pdf" + (!pdfLoaded ? " pdf-not-loaded" : "")} onClick={openPdf}>
              <Document file={filePath} onLoadSuccess={() => setPdfLoaded(true)}>
                <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
              {!pdfLoaded && <div className="lds-dual-ring" id="loading-pdf"></div>}
            </div>
            <ExamRating exam={exam} setExam={setExam} editMode={true} />
          </div>
        </>
      )}
    </div>
  );
}

export default ExamDetails;
