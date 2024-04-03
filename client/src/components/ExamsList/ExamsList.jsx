import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamRow from "./ExamRow";
import "../../styles/ExamsList.css";

function ExamsList(props) {
  const { filteredExams, showExams, isProfilePage } = props;
  const [idsToCourses, setIdsToCourses] = useState({});

  if (isProfilePage) {
    import("../../styles/ProfileExamsList.css");
  }

  useEffect(() => {
    if (showExams) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showExams]);

  useEffect(() => {
    if (filteredExams.length > 0) {
      filteredExams.forEach((exam) => {
        if (!idsToCourses[exam.course]) {
          axios
            .get(`${import.meta.env.VITE_SERVER_URL}/info/course/${exam.course}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                const course = res.data;
                setIdsToCourses({ ...idsToCourses, [exam.course]: course });
              }
            })
            .catch((err) => {
              handleError(err, () => {
                console.error(err.response.data.message);
                alert("שגיאה בטעינת הקורסים, אנא נסה שנית.");
              });
            });
        }
      });
    }
  }, [filteredExams]);

  return !showExams ? null : (
    <div className="exams-list">
      <label className="exams-list-count">סה"כ בחינות נמצאו: {filteredExams.length}</label>
      <div className="exams-list-container">
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
        <div className="exams-list-rows">
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} course={idsToCourses[exam.course]} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} course={idsToCourses[exam.course]} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} course={idsToCourses[exam.course]} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamsList;
