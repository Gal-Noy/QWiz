import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError } from "../utils/axiosUtils";
import ExamRating from "../components/ExamsList/ExamRating";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import "../styles/ExamPage.css";

function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/exams/${examId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setExam(res.data);
        }
      })
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

  useEffect(() => {
    if (exam) {
      const examURL = exam.s3Path;
      //   axios
      //     .get(`${import.meta.env.VITE_SERVER_URL}/uploads/${exam.file}`, {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       },
      //       responseType: "blob",
      //     })
      //     .then((res) => {
      //       setFile(res.data);
      //     })
      //     .catch((err) => {
      //       handleError(err, () => {
      //         console.error(err.response.data.message);
      //         alert("שגיאה בטעינת הבחינה, אנא נסה שנית.");
      //         navigate("/");
      //       });
      //     });
    }
  }, [exam]);

  console.log(exam);
  return (
    <div className="exam-page">
      <div className="exam-container">
        {isPending && <a className="loading-exam">טוען מבחן...</a>}
        {!isPending && exam && (
          <div className="exam-div">
            <div className="exam-details">
              <div className="exam-details-right-section">
                <a className="exam-details-header">פרטי הבחינה</a>
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
                    <a className="exam-details-item-header">דירוג:</a>
                    <ExamRating difficultyRating={exam.difficultyRating} examId={examId} editMode={false} />
                  </div>
                </div>
              </div>
              <div className="exam-details-left-section">
                <div className="exam-details-pdf">
                  <Document file={exam.s3Path}>
                    <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
                  </Document>
                </div>
                <ExamRating difficultyRating={exam.difficultyRating} examId={examId} editMode={true} />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* {isPending && <div>טוען מבחן...</div>}
      {!isPending && exam && (
        <div>
          <h2>{exam.title}</h2>
          <p>{exam.description}</p>
          <a href={`${import.meta.env.VITE_SERVER_URL}/uploads/${exam.file}`} download>
            הורדת הבחינה
          </a>
        </div>
      )} */}
    </div>
  );
}

export default ExamPage;
