import React, { useState, useEffect } from "react";
import ExamsList from "../components/ExamsList/ExamsList";
import FilterBar from "../components/FilterBar/FilterBar";
import "../styles/ExamsPage.css";

function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [showExams, setShowExams] = useState(false);

  return (
    <div className="exams-page">
      <div className="exams-page-header">
        <label>מאגר המבחנים של QWiz</label>
        <p>במאגר הבחינות מופיעים סיכומים ומבחנים עם פתרון מרצה או בציון של 85 ומעלה.</p>
        <p>החומרים במאגר מבוססים על העלאות של סטודנטים/ות.</p>
        <p>את הציון ניתן לראות על גבי טופס הבחינה.</p>
        <p>
          על מנת לבצע חיפוש, יש לבחור תחילה <strong>פקולטה, מחלקה וקורס</strong> (או לבצע חיפוש באמצעות טקסט חופשי).
        </p>
      </div>
      <FilterBar exams={exams} setExams={setExams} setFilteredExams={setFilteredExams} setShowExams={setShowExams} />
      <ExamsList filteredExams={filteredExams} showExams={showExams} />
    </div>
  );
}

export default ExamsPage;
