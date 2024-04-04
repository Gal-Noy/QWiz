import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamRow from "./ExamRow";
import "../../styles/ExamsList.css";

function ExamsList(props) {
  const { filteredExams, showExams, isProfilePage, isPending, error } = props;
  const [favoriteExams, setFavoriteExams] = useState([]);
  const [idsToCourses, setIdsToCourses] = useState({});

  useEffect(() => {
    if (showExams) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/exams/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const favoriteExamsIds = res.data.map((exam) => exam._id);
            setFavoriteExams(favoriteExamsIds);
          }
        })
        .catch((err) => {
          handleError(err, () => {
            console.error(err.response.data.message);
            alert("שגיאה בטעינת הבחינות המועדפות, אנא נסה שנית.");
          });
        });
    }
  }, [showExams]);

  useEffect(() => {
    if (filteredExams.length > 0) {
      filteredExams.forEach((exam) => {
        const courseId = exam.course;
        if (!idsToCourses[courseId]) {
          axios
            .get(`${import.meta.env.VITE_SERVER_URL}/info/course/${courseId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                const course = res.data;
                setIdsToCourses({ ...idsToCourses, [courseId]: course });
              }
            })
            .catch((err) => {
              handleError(err, () => {
                console.error(err.response.data.message);
              });
            });
        }
      });
    }
  }, [filteredExams]);

  return !showExams ? null : (
    <div className="exams-list">
      <label className="exams-list-count">סה"כ בחינות נמצאו: {filteredExams.length}</label>
      <div className={"exams-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className="headers-row">
          <div className="table-element favorite">מועדפים</div>
          <div className="table-element course-num">מספר קורס</div>
          <div className="table-element course-name">שם הקורס</div>
          <div className="table-element lecturers">מרצה/ים</div>
          <div className="table-element type">סוג בחינה</div>
          <div className="table-element year">שנה</div>
          <div className="table-element semester">סמסטר</div>
          <div className="table-element term">מועד</div>
          <div className="table-element grade">ציון</div>
          <div className="table-element rank">דירוג</div>
        </div>
        {isPending && !error && <div className="exams-list-loading">טוען...</div>}
        {error && <div className="exams-list-error">{error}</div>}
        {!isPending && !error && (
          <div className="exams-list-rows">
            {filteredExams.map((exam) => (
              <ExamRow
                key={exam._id}
                exam={exam}
                course={idsToCourses[exam.course]}
                favorite={favoriteExams.includes(exam._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsList;
