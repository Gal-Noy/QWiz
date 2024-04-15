import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import "./FilterBar.css";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { calcAvgRating } from "../../utils/generalUtils";

function FilterBar(props) {
  const { setFilteredExams, setShowExams, setError } = props;
  const [courseExams, setCourseExams] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [dropdownPendings, setDropdownPendings] = useState({
    faculties: false,
    departments: false,
    courses: false,
  });

  // Mandatory filters
  const [categoriesLists, setCategoriesLists] = useState({
    faculties: [],
    departments: [],
    courses: [],
  });
  const [chosenCategories, setChosenCategories] = useState({
    faculty: null,
    department: null,
    course: null,
  });

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

  const fetchFaculties = async () => {
    setDropdownPendings({ faculties: true, departments: false, courses: false });

    await axiosInstance
      .get("/info/faculties")
      .then((res) =>
        handleResult(res, 200, () => {
          const faculties = res.data;
          const sortedFaculties = faculties.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ faculties: sortedFaculties, departments: [], courses: [] });
        })
      )
      .catch((err) => handleError(err))
      .finally(() => setDropdownPendings({ faculties: false, departments: false, courses: false }));
  };

  const fetchDepartmentsByFaculty = async (facultyId) => {
    setDropdownPendings({ faculties: false, departments: true, courses: false });

    await axiosInstance
      .get(`/info/faculty/${facultyId}/departments`)
      .then((res) =>
        handleResult(res, 200, () => {
          const departments = res.data;
          const sortedDepartments = departments.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ ...categoriesLists, departments: sortedDepartments, courses: [] });
        })
      )
      .catch((err) => handleError(err))
      .finally(() => setDropdownPendings({ faculties: false, departments: false, courses: false }));
  };

  const fetchCoursesByDepartment = async (departmentId) => {
    setDropdownPendings({ faculties: false, departments: false, courses: true });

    await axiosInstance
      .get(`/info/department/${departmentId}/courses`)
      .then((res) =>
        handleResult(res, 200, () => {
          const courses = res.data;
          const sortedCourses = courses.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ ...categoriesLists, courses: sortedCourses });
        })
      )
      .catch((err) => handleError(err))
      .finally(() => setDropdownPendings({ faculties: false, departments: false, courses: false }));
  };

  const fetchCourseExams = async (courseId) => {
    setIsPending(true);

    await axiosInstance
      .get(`/exams/course/${courseId}`)
      .then((res) => handleResult(res, 200, () => setCourseExams(res.data)))
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת המבחנים, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  const updateAdvancedSearchLists = () => {
    let updatedAdvancedSearchLists = { ...advancedSearchLists };

    courseExams.forEach((exam) => {
      if (!updatedAdvancedSearchLists.lecturers.includes(exam.lecturers)) {
        updatedAdvancedSearchLists.lecturers.push(exam.lecturers);
      }
      if (!updatedAdvancedSearchLists.years.includes(exam.year)) {
        updatedAdvancedSearchLists.years.push(exam.year);
      }
      const examSemester = exam.semester === 1 ? "'א" : exam.semester === 2 ? "'ב" : "'ג";
      if (!updatedAdvancedSearchLists.semesters.includes(examSemester)) {
        updatedAdvancedSearchLists.semesters.push(examSemester);
      }
      const examTerm = exam.term === 1 ? "'א" : exam.term === 2 ? "'ב" : "'ג";
      if (!updatedAdvancedSearchLists.terms.includes(examTerm)) {
        updatedAdvancedSearchLists.terms.push(examTerm);
      }
      const examType = exam.type === "test" ? "מבחן" : "בוחן";
      if (!updatedAdvancedSearchLists.types.includes(examType)) {
        updatedAdvancedSearchLists.types.push(examType);
      }
      const minGrade = Math.floor(exam.grade / 10) * 10;
      if (!updatedAdvancedSearchLists.minGrades.includes(`${minGrade}+`)) {
        updatedAdvancedSearchLists.minGrades.push(`${minGrade}+`);
      }
      const difficultyRating = Math.floor(calcAvgRating(exam.difficultyRatings));
      if (!updatedAdvancedSearchLists.difficultyRatings.includes(`${difficultyRating}+`)) {
        updatedAdvancedSearchLists.difficultyRatings.push(`${difficultyRating}+`);
      }

      // Sort lists
      updatedAdvancedSearchLists.lecturers.sort();
      updatedAdvancedSearchLists.years.sort();
      updatedAdvancedSearchLists.semesters.sort();
      updatedAdvancedSearchLists.terms.sort();
      updatedAdvancedSearchLists.types.sort();
      updatedAdvancedSearchLists.minGrades.sort();
      updatedAdvancedSearchLists.difficultyRatings.sort();

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
    setFreeText;
  };

  const clearFilters = () => {
    setCategoriesLists({ ...categoriesLists, departments: [], courses: [] });
    setChosenCategories({ faculty: null, department: null, course: null });
    clearAdvancedFilters();
  };

  const filterAndSearchExams = () => {
    if (isPending) return;
    // Exams are already filtered by faculty, department, and course
    if (!chosenCategories.faculty || !chosenCategories.department || !chosenCategories.course) {
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
          Math.floor(exam.grade / 10) * 10 === freeText ||
          Math.floor(calcAvgRating(exam.difficultyRatings)) === freeText
      );
    }

    advancedSearchChoices.lecturers &&
      (filteredExams = filteredExams.filter((exam) => exam.lecturers === advancedSearchChoices.lecturers));
    advancedSearchChoices.year &&
      (filteredExams = filteredExams.filter((exam) => exam.year === advancedSearchChoices.year));
    const examSemesterFilter =
      advancedSearchChoices.semester === "'א" ? 1 : advancedSearchChoices.semester === "'ב" ? 2 : 3;
    advancedSearchChoices.semester &&
      (filteredExams = filteredExams.filter((exam) => exam.semester === examSemesterFilter));
    const examTermFilter = advancedSearchChoices.term === "'א" ? 1 : advancedSearchChoices.term === "'ב" ? 2 : 3;
    advancedSearchChoices.term && (filteredExams = filteredExams.filter((exam) => exam.term === examTermFilter));
    const examTypeFilter = advancedSearchChoices.type === "מבחן" ? "test" : "quiz";
    advancedSearchChoices.type && (filteredExams = filteredExams.filter((exam) => exam.type === examTypeFilter));
    const minGradeFilter = advancedSearchChoices.minGrade ? parseInt(advancedSearchChoices.minGrade.slice(0, -1)) : 0;
    advancedSearchChoices.minGrade &&
      (filteredExams = filteredExams.filter((exam) => Math.floor(exam.grade / 10) * 10 >= minGradeFilter));
    const difficultyRatingFilter = advancedSearchChoices.difficultyRating
      ? parseInt(advancedSearchChoices.difficultyRating.slice(0, -1))
      : 0;
    advancedSearchChoices.difficultyRating &&
      (filteredExams = filteredExams.filter(
        (exam) => Math.floor(calcAvgRating(exam.difficultyRatings)) >= difficultyRatingFilter
      ));

    setFilteredExams(filteredExams);
    setShowExams(true);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    setCategoriesLists({ ...categoriesLists, departments: [], courses: [] });
    setChosenCategories({ ...chosenCategories, department: null, course: null });
    clearAdvancedFilters();
    if (chosenCategories.faculty) {
      fetchDepartmentsByFaculty(chosenCategories.faculty._id);
    }
  }, [chosenCategories.faculty]);

  useEffect(() => {
    setCategoriesLists({ ...categoriesLists, courses: [] });
    setChosenCategories({ ...chosenCategories, course: null });
    if (chosenCategories.department) {
      fetchCoursesByDepartment(chosenCategories.department._id);
    } else {
      clearAdvancedFilters();
    }
  }, [chosenCategories.department]);

  useEffect(() => {
    if (chosenCategories.course) {
      fetchCourseExams(chosenCategories.course._id);
    } else {
      clearAdvancedFilters();
    }
  }, [chosenCategories.course]);

  useEffect(() => {
    updateAdvancedSearchLists();
  }, [courseExams]);

  return (
    <div className="filter-bar">
      <div id="mandatory-filters-row" className="filter-bar-row">
        <FilterDropdown
          label="פקולטה"
          options={categoriesLists.faculties}
          value={chosenCategories.faculty}
          setValue={(val) => setChosenCategories({ ...chosenCategories, faculty: val })}
          isAvailable={categoriesLists.faculties.length > 0}
          size={"l"}
          isPending={dropdownPendings.faculties}
          isSearchable={true}
        />
        <FilterDropdown
          label="מחלקה"
          options={categoriesLists.departments}
          value={chosenCategories.department}
          setValue={(val) => setChosenCategories({ ...chosenCategories, department: val })}
          isAvailable={categoriesLists.departments.length > 0}
          size={"l"}
          isPending={dropdownPendings.departments}
          isSearchable={true}
        />
        <FilterDropdown
          label="קורס"
          options={categoriesLists.courses}
          value={chosenCategories.course}
          setValue={(val) => setChosenCategories({ ...chosenCategories, course: val })}
          isAvailable={categoriesLists.courses.length > 0}
          size={"l"}
          isPending={dropdownPendings.courses}
          isSearchable={true}
        />
      </div>
      <div className="bottom-filters-container">
        <div className={"advanced-filters-rows" + (showAdvancedFilters ? " show" : "")}>
          <FilterDropdown
            label="מרצים"
            options={advancedSearchLists.lecturers}
            value={advancedSearchChoices.lecturers}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, lecturers: val })}
            isAvailable={advancedSearchLists.lecturers.length > 0}
            size={"m"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="שנה"
            options={advancedSearchLists.years}
            value={advancedSearchChoices.year}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, year: val })}
            isAvailable={advancedSearchLists.years.length > 0}
            size={"m"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="סמסטר"
            options={advancedSearchLists.semesters}
            value={advancedSearchChoices.semester}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, semester: val })}
            isAvailable={advancedSearchLists.semesters.length > 0}
            size={"m"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="מועד"
            options={advancedSearchLists.terms}
            value={advancedSearchChoices.term}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, term: val })}
            isAvailable={advancedSearchLists.terms.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="סוג"
            options={advancedSearchLists.types}
            value={advancedSearchChoices.type}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, type: val })}
            isAvailable={advancedSearchLists.types.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="ציון מינימלי"
            options={advancedSearchLists.minGrades}
            value={advancedSearchChoices.minGrade}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, minGrade: val })}
            isAvailable={advancedSearchLists.minGrades.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
          <FilterDropdown
            label="דרגת קושי"
            options={advancedSearchLists.difficultyRatings}
            value={advancedSearchChoices.difficultyRating}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, difficultyRating: val })}
            isAvailable={advancedSearchLists.difficultyRatings.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={false}
          />
        </div>
        <div className="filter-bar-buttons-row">
          <div className="filter-bar-button" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            חיפוש מתקדם
            <span className="material-symbols-outlined filter-dropdown-arrow">
              {showAdvancedFilters ? "expand_less" : "expand_more"}
            </span>
          </div>
          <div className="filter-bar-button" id="filter-bar-clear-filter-button" onClick={clearFilters}>
            נקה סינון
          </div>
          <input
            className="filter-bar-search-input"
            type="text"
            placeholder="טקסט חופשי"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
          <div
            className={"filter-bar-button" + (isPending ? " pending" : "")}
            id="filter-bar-search-button"
            onClick={filterAndSearchExams}
          >
            {isPending ? <div className="lds-dual-ring"></div> : "חיפוש מבחנים"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
