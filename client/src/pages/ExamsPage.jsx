import React, { useState, useEffect } from "react";
import ExamsList from "../components/ExamsList";
import FilterBar from "../components/FilterBar/FilterBar";
import "../styles/ExamsPage.css";

function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [showExams, setShowExams] = useState(false);

  return (
    <div className="exams-page">
      <FilterBar exams={exams} setExams={setExams} setFilteredExams={setFilteredExams} setShowExams={setShowExams} />
      <ExamsList filteredExams={filteredExams} showExams={showExams} />
    </div>
  );
}

export default ExamsPage;
