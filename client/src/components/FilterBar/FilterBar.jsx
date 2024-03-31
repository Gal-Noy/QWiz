import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import "./FilterBar.css";
import axios from "axios";

function FilterBar(props) {
  const { exams, setExams, setFilteredExams, setShowExams } = props;

  // Mandatory filters
  const [faculties, setFaculties] = useState([]);
  const [chosenFaculty, setChosenFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);

  // Optional filters (Advanced search)
  const [advancedSearchLists, setAdvancedSearchLists] = useState({
    lecturers: [],
    years: [],
    semesters: [],
    terms: [],
    types: [],
    minGrades: [],
    difficultyRatings: [],
  });
  const [advancedSearchChoices, setAdvancedSearchChoices] = useState({
    lecturers: null,
    year: null,
    semester: null,
    term: null,
    type: null,
    minGrade: null,
    difficultyRating: null,
  });

  const fetchFaculties = async () =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculties`)
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error(err));

  const fetchDepartmentsByFaculty = async (facultyId) =>
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculty/${facultyId}/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));

  const fetchCoursesByDepartment = async (departmentId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/department/${departmentId}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

  const fetchCourseExams = async (courseId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/exams/course/${courseId}`)
      .then((res) => setExams(res.data))
      .catch((err) => console.error(err));

  const updateAdvancedSearchLists = () => {
    const updatedAdvancedSearchLists = { ...advancedSearchLists };

    exams.forEach((exam) => {
      if (!advancedSearchLists.lecturers.includes(exam.lecturers)) {
        updatedAdvancedSearchLists.lecturers = [...updatedAdvancedSearchLists.lecturers, exam.lecturers];
      }
      if (!advancedSearchLists.years.includes(exam.year)) {
        updatedAdvancedSearchLists.years = [...updatedAdvancedSearchLists.years, exam.year];
      }
      if (!advancedSearchLists.semesters.includes(exam.semester)) {
        updatedAdvancedSearchLists.semesters = [
          ...updatedAdvancedSearchLists.semesters,
          `${exam.semester === 1 ? "'א" : exam.semester === 2 ? "'ב" : "'ג"}`,
        ];
      }
      if (!advancedSearchLists.terms.includes(exam.term)) {
        updatedAdvancedSearchLists.terms = [
          ...updatedAdvancedSearchLists.terms,
          `${exam.term === 1 ? "'א" : exam.term === 2 ? "'ב" : "'ג"}`,
        ];
      }
      if (!advancedSearchLists.types.includes(exam.type)) {
        updatedAdvancedSearchLists.types = [
          ...updatedAdvancedSearchLists.types,
          `${exam.type === "test" ? "מבחן" : "בוחן"}`,
        ];
      }
      const minGrade = Math.floor(exam.grade / 10) * 10;
      if (!advancedSearchLists.minGrades.includes(minGrade)) {
        updatedAdvancedSearchLists.minGrades = [...updatedAdvancedSearchLists.minGrades, `${minGrade}+`];
      }
      const difficultyRating = Math.floor(exam.difficultyRating.averageRating);
      if (!advancedSearchLists.difficultyRatings.includes(difficultyRating)) {
        updatedAdvancedSearchLists.difficultyRatings = [
          ...updatedAdvancedSearchLists.difficultyRatings,
          `${difficultyRating}+`,
        ];
      }

      setAdvancedSearchLists(updatedAdvancedSearchLists);
    });
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    setDepartments([]);
    setChosenDepartment(null);
    setCourses([]);
    setChosenCourse(null);
    if (chosenFaculty) {
      fetchDepartmentsByFaculty(chosenFaculty._id);
    }
  }, [chosenFaculty]);

  useEffect(() => {
    setCourses([]);
    setChosenCourse(null);
    if (chosenDepartment) {
      fetchCoursesByDepartment(chosenDepartment._id);
    }
  }, [chosenDepartment]);

  useEffect(() => {
    if (chosenCourse) {
      fetchCourseExams(chosenCourse._id);
    }
  }, [chosenCourse]);

  useEffect(() => {
    setFilteredExams(exams);
    updateAdvancedSearchLists();
  }, [exams]);

  return (
    <div className="filter-bar">
      <div className="filter-bar-row">
        <FilterDropdown
          label="פקולטה"
          options={faculties}
          value={chosenFaculty}
          setValue={(val) => setChosenFaculty(val)}
          isAvailable={faculties.length > 0}
        />
        <FilterDropdown
          label="מחלקה"
          options={departments}
          value={chosenDepartment}
          setValue={(val) => setChosenDepartment(val)}
          isAvailable={departments.length > 0}
        />
        <FilterDropdown
          label="קורס"
          options={courses}
          value={chosenCourse}
          setValue={(val) => setChosenCourse(val)}
          isAvailable={courses.length > 0}
        />
      </div>
      <div className="filter-bar-row">
        <FilterDropdown
          label="מרצים"
          options={advancedSearchLists.lecturers}
          value={advancedSearchChoices.lecturers}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, lecturers: val })}
          isAvailable={advancedSearchLists.lecturers.length > 0}
        />
        <FilterDropdown
          label="שנה"
          options={advancedSearchLists.years}
          value={advancedSearchChoices.year}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, year: val })}
          isAvailable={advancedSearchLists.years.length > 0}
        />
        <FilterDropdown
          label="סמסטר"
          options={advancedSearchLists.semesters}
          value={advancedSearchChoices.semester}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, semester: val })}
          isAvailable={advancedSearchLists.semesters.length > 0}
        />
        <FilterDropdown
          label="מועד"
          options={advancedSearchLists.terms}
          value={advancedSearchChoices.term}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, term: val })}
          isAvailable={advancedSearchLists.terms.length > 0}
        />
        <FilterDropdown
          label="סוג"
          options={advancedSearchLists.types}
          value={advancedSearchChoices.type}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, type: val })}
          isAvailable={advancedSearchLists.types.length > 0}
        />
        <FilterDropdown
          label="ציון מינימלי"
          options={advancedSearchLists.minGrades}
          value={advancedSearchChoices.minGrade}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, minGrade: val })}
          isAvailable={advancedSearchLists.minGrades.length > 0}
        />
        <FilterDropdown
          label="דרגת קושי"
          options={advancedSearchLists.difficultyRatings}
          value={advancedSearchChoices.difficultyRating}
          setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, difficultyRating: val })}
          isAvailable={advancedSearchLists.difficultyRatings.length > 0}
        />
      </div>
    </div>
  );
}

export default FilterBar;
