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
  const [showExams, setShowExams] = useState(false);
  const [query, setQuery] = useState("/exams");

  const paragraphs = [
    "החומרים במאגר מבוססים על העלאות של סטודנטים/ות.",
    "על מנת לבצע חיפוש, יש לבחור תחילה פקולטה, מחלקה וקורס (או לבצע חיפוש באמצעות טקסט חופשי).",
  ];

  return (
    <div className="search-page">
      <PageHeader title={"מאגר המבחנים של QWiz"} paragraphs={paragraphs} />
      <FilterBar setQuery={setQuery} setShowExams={setShowExams} />
      <ExamsList
        query={query}
        showExams={showExams}
        isProfilePage={false}
      />
    </div>
  );
}

export default ExamsSearchPage;
