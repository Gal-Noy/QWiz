import React, { useEffect } from "react";
import ExamRow from "./ExamRow";
import "../../styles/ExamsList.css";

function ExamsList(props) {
  const { filteredExams, showExams } = props;

  useEffect(() => {
    if (showExams) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showExams]);

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
            <ExamRow key={exam._id} exam={exam} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} />
          ))}
          {filteredExams.map((exam) => (
            <ExamRow key={exam._id} exam={exam} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamsList;
