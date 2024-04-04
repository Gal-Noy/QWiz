import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import "../../styles/FilterBar.css";
import { handleError } from "../../utils/axiosUtils";
import axios from "axios";

function FilterBar(props) {
  const { setFilteredExams, setShowExams, setError } = props;
  const [courseExams, setCourseExams] = useState([]);

  // Mandatory filters
  const [faculties, setFaculties] = useState([]);
  const [chosenFaculty, setChosenFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);

  // Optional filters (Advanced search)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
  const [freeText, setFreeText] = useState("");

  const fetchFaculties = async () =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculties`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const faculties = res.data;
        const sortedFaculties = faculties.sort((a, b) => (a.name > b.name ? 1 : -1));
        setFaculties(sortedFaculties);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  const fetchDepartmentsByFaculty = async (facultyId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculty/${facultyId}/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const departments = res.data;
        const sortedDepartments = departments.sort((a, b) => (a.name > b.name ? 1 : -1));
        setDepartments(sortedDepartments);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  const fetchCoursesByDepartment = async (departmentId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/department/${departmentId}/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const courses = res.data;
        const sortedCourses = courses.sort((a, b) => (a.name > b.name ? 1 : -1));
        setCourses(sortedCourses);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  const fetchCourseExams = async (courseId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/exams/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCourseExams(res.data))
      .catch((err) =>
        handleError(err, () => {
          console.log(err.response.data.message);
          setError(err.response.data.message);
        })
      );

  const updateAdvancedSearchLists = () => {
    const updatedAdvancedSearchLists = { ...advancedSearchLists };

    courseExams.forEach((exam) => {
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

  const clearAdvancedFilters = () => {
    setAdvancedSearchChoices({
      lecturers: null,
      year: null,
      semester: null,
      term: null,
      type: null,
      minGrade: null,
      difficultyRating: null,
    });
    setAdvancedSearchLists({
      lecturers: [],
      years: [],
      semesters: [],
      terms: [],
      types: [],
      minGrades: [],
      difficultyRatings: [],
    });
    setFreeText("");
  };

  const clearFilters = () => {
    setChosenFaculty(null);
    setDepartments([]);
    setChosenDepartment(null);
    setCourses([]);
    setChosenCourse(null);
    clearAdvancedFilters();
  };

  const filterAndSearchExams = () => {
    // Exams are already filtered by faculty, department, and course
    if (!chosenCourse || !chosenDepartment || !chosenFaculty) {
      alert("יש לבחור פקולטה, מחלקה וקורס לפני החיפוש");
      return;
    }

    let filteredExams = courseExams;

    if (freeText) {
      filteredExams = filteredExams.filter(
        (exam) =>
          exam.lecturers.includes(freeText) ||
          exam.year === freeText ||
          exam.semester === freeText ||
          exam.term === freeText ||
          exam.type === freeText ||
          exam.grade === freeText ||
          exam.difficultyRating.averageRating === freeText
      );
    }

    advancedSearchChoices.lecturers &&
      (filteredExams = filteredExams.filter((exam) => exam.lecturers === advancedSearchChoices.lecturers));
    advancedSearchChoices.year &&
      (filteredExams = filteredExams.filter((exam) => exam.year === advancedSearchChoices.year));
    advancedSearchChoices.semester &&
      (filteredExams = filteredExams.filter((exam) => exam.semester === advancedSearchChoices.semester));
    advancedSearchChoices.term &&
      (filteredExams = filteredExams.filter((exam) => exam.term === advancedSearchChoices.term));
    advancedSearchChoices.type &&
      (filteredExams = filteredExams.filter((exam) => exam.type === advancedSearchChoices.type));
    advancedSearchChoices.minGrade &&
      (filteredExams = filteredExams.filter(
        (exam) => Math.floor(exam.grade / 10) * 10 >= advancedSearchChoices.minGrade
      ));
    advancedSearchChoices.difficultyRating &&
      (filteredExams = filteredExams.filter(
        (exam) => Math.floor(exam.difficultyRating.averageRating) >= advancedSearchChoices.difficultyRating
      ));

    setFilteredExams(filteredExams);
    setShowExams(true);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    setDepartments([]);
    setChosenDepartment(null);
    setCourses([]);
    setChosenCourse(null);
    clearAdvancedFilters();
    if (chosenFaculty) {
      fetchDepartmentsByFaculty(chosenFaculty._id);
    }
  }, [chosenFaculty]);

  useEffect(() => {
    setCourses([]);
    setChosenCourse(null);
    if (!chosenDepartment) {
      clearAdvancedFilters();
    }
    if (chosenDepartment) {
      fetchCoursesByDepartment(chosenDepartment._id);
    }
  }, [chosenDepartment]);

  useEffect(() => {
    if (!chosenCourse) {
      clearAdvancedFilters();
    }
    if (chosenCourse) {
      fetchCourseExams(chosenCourse._id);
    }
  }, [chosenCourse]);

  useEffect(() => {
    updateAdvancedSearchLists();
  }, [courseExams]);

  return (
    <div className="filter-bar">
      <div className="filter-bar-search-message">* ניתן להקליד על מנת לחפש פריטים ברשימות</div>
      <div id="mandatory-filters-row" className="filter-bar-row">
        <FilterDropdown
          index={0}
          label="פקולטה"
          options={faculties}
          value={chosenFaculty}
          setValue={(val) => setChosenFaculty(val)}
          isAvailable={faculties.length > 0}
        />
        <FilterDropdown
          index={1}
          label="מחלקה"
          options={departments}
          value={chosenDepartment}
          setValue={(val) => setChosenDepartment(val)}
          isAvailable={departments.length > 0}
        />
        <FilterDropdown
          index={2}
          label="קורס"
          options={courses}
          value={chosenCourse}
          setValue={(val) => setChosenCourse(val)}
          isAvailable={courses.length > 0}
        />
      </div>
      <div className={"advanced-filters-rows" + (showAdvancedFilters ? " show" : "")}>
        <div className="filter-bar-row">
          <FilterDropdown
            index={3}
            label="מרצים"
            options={advancedSearchLists.lecturers}
            value={advancedSearchChoices.lecturers}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, lecturers: val })}
            isAvailable={advancedSearchLists.lecturers.length > 0}
          />
          <FilterDropdown
            index={4}
            label="שנה"
            options={advancedSearchLists.years}
            value={advancedSearchChoices.year}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, year: val })}
            isAvailable={advancedSearchLists.years.length > 0}
          />
          <FilterDropdown
            index={5}
            label="סמסטר"
            options={advancedSearchLists.semesters}
            value={advancedSearchChoices.semester}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, semester: val })}
            isAvailable={advancedSearchLists.semesters.length > 0}
          />
        </div>
        <div className="filter-bar-row">
          <FilterDropdown
            index={6}
            label="מועד"
            options={advancedSearchLists.terms}
            value={advancedSearchChoices.term}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, term: val })}
            isAvailable={advancedSearchLists.terms.length > 0}
          />
          <FilterDropdown
            index={7}
            label="סוג"
            options={advancedSearchLists.types}
            value={advancedSearchChoices.type}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, type: val })}
            isAvailable={advancedSearchLists.types.length > 0}
          />
          <FilterDropdown
            index={8}
            label="ציון מינימלי"
            options={advancedSearchLists.minGrades}
            value={advancedSearchChoices.minGrade}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, minGrade: val })}
            isAvailable={advancedSearchLists.minGrades.length > 0}
          />
          <FilterDropdown
            index={9}
            label="דרגת קושי"
            options={advancedSearchLists.difficultyRatings}
            value={advancedSearchChoices.difficultyRating}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, difficultyRating: val })}
            isAvailable={advancedSearchLists.difficultyRatings.length > 0}
          />
        </div>
      </div>
      <div id="filter-bar-buttons">
        <button className="filter-bar-btn" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          סינון מתקדם
        </button>
        <button className="filter-bar-btn" onClick={clearFilters}>
          נקה סינון
        </button>
        <input
          className="free-text-input"
          type="text"
          placeholder="טקסט חופשי"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
        <button className="filter-bar-btn" onClick={filterAndSearchExams}>
          חפש מבחנים
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
