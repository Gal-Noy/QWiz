import React, { useEffect } from "react";
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
        <div className="exams-list-headers">
          <label className="exams-list-header">מועדפים</label>
          <label className="exams-list-header">מספר קורס</label>
          <label className="exams-list-header">שם הקורס</label>
          <label className="exams-list-header">מרצה/ים</label>
          <label className="exams-list-header">סוג בחינה</label>
          <label className="exams-list-header">שנה</label>
          <label className="exams-list-header">סמסטר</label>
          <label className="exams-list-header">מועד</label>
          <label className="exams-list-header">ציון בחינה</label>
          <label className="exams-list-header">דירוג</label>
        </div>
      </div>
    </div>
  );
}

export default ExamsList;
