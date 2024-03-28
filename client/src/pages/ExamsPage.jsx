import React, { useState, useEffect } from "react";
import ExamsList from "../components/ExamsList";
import FilterBar from "../components/FilterBar/FilterBar";
import "../styles/ExamsPage.css";

function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [filters, setFilters] = useState({
    faculty: "",
    department: "",
    course: "",
    year: "",
    semester: "",
    term: "",
    type: "",
    grade: "",
    lecturers: "",
    difficultyRating: "",
  });

  return (
    <div className="exams-page">
      <FilterBar filters={filters} setFilters={setFilters} />
      <ExamsList />
    </div>
  );
}

export default ExamsPage;
