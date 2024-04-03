import React, { useState, useEffect } from "react";
import ExamsList from "../components/ExamsList/ExamsList";
import FilterBar from "../components/FilterBar/FilterBar";
import PageHeader from "../components/PageHeader";
import "../styles/SearchPage.css";

function SearchPage() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [showExams, setShowExams] = useState(false);

  const paragraphs = [
    "במאגר הבחינות מופיעים סיכומים ומבחנים עם פתרון מרצה או בציון של 85 ומעלה.",
    "החומרים במאגר מבוססים על העלאות של סטודנטים/ות.",
    "את הציון ניתן לראות על גבי טופס הבחינה.",
    "על מנת לבצע חיפוש, יש לבחור תחילה פקולטה, מחלקה וקורס (או לבצע חיפוש באמצעות טקסט חופשי).",
  ];

  return (
    <div className="exams-page">
      <PageHeader title={"מאגר המבחנים של QWiz"} paragraphs={paragraphs} />
      <FilterBar exams={exams} setExams={setExams} setFilteredExams={setFilteredExams} setShowExams={setShowExams} />
      <ExamsList filteredExams={filteredExams} showExams={showExams} />
    </div>
  );
}

export default SearchPage;
