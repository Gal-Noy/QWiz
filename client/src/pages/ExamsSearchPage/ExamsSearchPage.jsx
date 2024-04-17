import React, { useState } from "react";
import ExamsList from "../../components/ExamsList/ExamsList";
import FilterBar from "../../components/FilterBar/FilterBar";
import PageHeader from "../../components/PageHeader/PageHeader";
import "./ExamsSearchPage.css";

/**
 * The exams search page component.
 *
 * @component
 * @returns {JSX.Element} The rendered ExamsSearchPage component.
 */
function ExamsSearchPage() {
  const [filteredExams, setFilteredExams] = useState([]);
  const [showExams, setShowExams] = useState(false);
  const [error, setError] = useState(null);

  const paragraphs = [
    "החומרים במאגר מבוססים על העלאות של סטודנטים/ות.",
    "על מנת לבצע חיפוש, יש לבחור תחילה פקולטה, מחלקה וקורס (או לבצע חיפוש באמצעות טקסט חופשי).",
  ];

  return (
    <div className="search-page">
      <PageHeader title={"מאגר המבחנים של QWiz"} paragraphs={paragraphs} />
      <FilterBar setFilteredExams={setFilteredExams} setShowExams={setShowExams} setError={setError} />
      <ExamsList
        exams={filteredExams}
        setExams={setFilteredExams}
        showExams={showExams}
        isProfilePage={false}
        error={error}
      />
    </div>
  );
}

export default ExamsSearchPage;
