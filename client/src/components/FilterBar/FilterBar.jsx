import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { calcAvgRating } from "../../utils/generalUtils";
import { toast } from "react-custom-alert";
import "./FilterBar.css";

/**
 * Represents the FilterBar component.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setFilteredExams - The function to set the filtered exams.
 * @param {Function} props.setShowExams - The function to set the visibility of exams.
 * @param {Function} props.setError - The function to set the error message.
 * @returns {JSX.Element} The FilterBar component.
 */
function FilterBar(props) {
  const { setFilteredExams, setShowExams, setError } = props;

  const [courseExams, setCourseExams] = useState([]);
  const [examsPending, setExamsPending] = useState(false);
  const [dropdownPendings, setDropdownPendings] = useState({
    faculties: false,
    departments: false,
    courses: false,
    advancedFilters: false,
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
  const [freeText, setFreeText] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedSearchLists, setAdvancedSearchLists] = useState({
    years: [],
    semesters: [],
    terms: [],
    types: [],
    minGrades: [],
    difficultyRatings: [],
    lecturers: [],
    tags: [],
  });
  const [advancedSearchChoices, setAdvancedSearchChoices] = useState({
    // single choice
    type: null,
    minGrade: null,
    difficultyRating: null,
    // multiple choices
    years: [],
    semesters: [],
    terms: [],
    lecturers: [],
    tags: [],
  });

  /**
   * Fetches the faculties from the server.
   *
   * @async
   * @function fetchFaculties
   * @returns {Promise<void>} A Promise that resolves when the faculties are fetched.
   */
  const fetchFaculties = async () => {
    setDropdownPendings({ faculties: true, departments: false, courses: false, advancedFilters: false });

    await axiosInstance
      .get("/categories/faculties")
      .then((res) =>
        handleResult(res, 200, () => {
          const faculties = res.data;
          const sortedFaculties = faculties.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ faculties: sortedFaculties, departments: [], courses: [] });
        })
      )
      .catch((err) => handleError(err))
      .finally(() =>
        setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false })
      );
  };

  /**
   * Fetches the departments of a faculty from the server.
   *
   * @async
   * @function fetchDepartmentsByFaculty
   * @param {string} facultyId - The ID of
   * @returns {Promise<void>} A Promise that resolves when the departments are fetched.
   */
  const fetchDepartmentsByFaculty = async (facultyId) => {
    setDropdownPendings({ faculties: false, departments: true, courses: false, advancedFilters: false });

    await axiosInstance
      .get(`/categories/faculty/${facultyId}/departments`)
      .then((res) =>
        handleResult(res, 200, () => {
          const departments = res.data;
          const sortedDepartments = departments.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ ...categoriesLists, departments: sortedDepartments, courses: [] });
        })
      )
      .catch((err) => handleError(err))
      .finally(() =>
        setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false })
      );
  };

  /**
   * Fetches the courses of a department from the server.
   *
   * @async
   * @function fetchCoursesByDepartment
   * @param {string} departmentId - The ID of the department.
   * @returns {Promise<void>} A Promise that resolves when the courses are fetched.
   */
  const fetchCoursesByDepartment = async (departmentId) => {
    setDropdownPendings({ faculties: false, departments: false, courses: true, advancedFilters: false });

    await axiosInstance
      .get(`/categories/department/${departmentId}/courses`)
      .then((res) =>
        handleResult(res, 200, () => {
          const courses = res.data;
          const sortedCourses = courses.sort((a, b) => (a.name > b.name ? 1 : -1));
          setCategoriesLists({ ...categoriesLists, courses: sortedCourses });
        })
      )
      .catch((err) => handleError(err))
      .finally(() =>
        setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false })
      );
  };

  /**
   * Fetches course attributes (lecturers, tags) and course exams for a given courseId.
   *
   * @async
   * @function fetchCourseAttributesAndExams
   * @param {string} courseId - The ID of the course.
   * @returns {Promise<void>} - A Promise that resolves when the data is fetched successfully.
   */
  const fetchCourseAttributesAndExams = async (courseId) => {
    setExamsPending(true);
    setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: true });

    // Fetch course attributes (lecturers, tags)
    await axiosInstance
      .get(`/categories/course/${courseId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const { lecturers, tags } = res.data;
          setAdvancedSearchLists({ ...advancedSearchLists, lecturers, tags });
        })
      )
      .catch((err) => handleError(err));

    // Fetch course exams
    await axiosInstance
      .get(`/exams/course/${courseId}`)
      .then((res) => handleResult(res, 200, () => setCourseExams(res.data)))
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת מבחני הקורס, אנא נסה שנית.")));
  };

  /**
   * Updates the advanced search lists based on the fetched course exams.
   *
   * @function updateAdvancedSearchLists
   * @returns {void}
   */
  const updateAdvancedSearchLists = () => {
    let updatedAdvancedSearchLists = { ...advancedSearchLists };

    courseExams.forEach((exam) => {
      if (!updatedAdvancedSearchLists.years.includes(exam.year)) {
        updatedAdvancedSearchLists.years.push(exam.year);
      }
      const examSemester = exam.semester === 1 ? "א" : exam.semester === 2 ? "ב" : "קיץ";
      if (!updatedAdvancedSearchLists.semesters.includes(examSemester)) {
        updatedAdvancedSearchLists.semesters.push(examSemester);
      }
      const examTerm = exam.term === 1 ? "א" : exam.term === 2 ? "ב" : "ג";
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
      updatedAdvancedSearchLists.years.sort();
      updatedAdvancedSearchLists.semesters.sort();
      updatedAdvancedSearchLists.terms.sort();
      updatedAdvancedSearchLists.types.sort();
      updatedAdvancedSearchLists.minGrades.sort();
      updatedAdvancedSearchLists.difficultyRatings.sort();

      setAdvancedSearchLists(updatedAdvancedSearchLists);

      setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false });
      setExamsPending(false);
    });
  };

  /**
   * Clears the advanced search filters.
   *
   * @function clearAdvancedFilters
   * @returns {void}
   */
  const clearAdvancedFilters = () => {
    setAdvancedSearchChoices({
      type: null,
      minGrade: null,
      difficultyRating: null,
      years: [],
      semesters: [],
      terms: [],
      lecturers: [],
      tags: [],
    });
    setAdvancedSearchLists({
      years: [],
      semesters: [],
      terms: [],
      types: [],
      minGrades: [],
      difficultyRatings: [],
      lecturers: [],
      tags: [],
    });
    setFreeText("");
  };

  /**
   * Clears all filters.
   *
   * @function clearFilters
   * @returns {void}
   */
  const clearFilters = () => {
    setCategoriesLists({ ...categoriesLists, departments: [], courses: [] });
    setChosenCategories({ faculty: null, department: null, course: null });
    clearAdvancedFilters();
  };

  /**
   * Filters and searches the exams based on the chosen filters.
   *
   * @function filterAndSearchExams
   * @returns {void}
   */
  const filterAndSearchExams = () => {
    if (examsPending) return;

    // Exams are already filtered by faculty, department, and course
    if (!chosenCategories.faculty || !chosenCategories.department || !chosenCategories.course) {
      toast.warning("יש לבחור פקולטה, מחלקה וקורס לפני החיפוש");
      return;
    }

    let filteredExams = courseExams;

    // Filter by free text
    if (freeText) {
      filteredExams = filteredExams.filter(
        (exam) =>
          exam.year === freeText ||
          exam.semester === freeText ||
          exam.term === freeText ||
          exam.type === freeText ||
          exam.grade === freeText ||
          Math.floor(exam.grade / 10) * 10 === freeText ||
          Math.floor(calcAvgRating(exam.difficultyRatings)) === freeText ||
          exam.lecturers.includes(freeText) ||
          exam.tags.includes(freeText)
      );
    }

    // Filter by advanced search choices

    // Single choice filters
    advancedSearchChoices.type &&
      (filteredExams = filteredExams.filter((exam) =>
        advancedSearchChoices.type === "מבחן" ? exam.type === "test" : exam.type === "quiz"
      ));
    advancedSearchChoices.minGrade &&
      (filteredExams = filteredExams.filter(
        (exam) => Math.floor(exam.grade / 10) * 10 >= parseInt(advancedSearchChoices.minGrade.slice(0, -1))
      ));
    advancedSearchChoices.difficultyRating &&
      (filteredExams = filteredExams.filter(
        (exam) =>
          Math.floor(calcAvgRating(exam.difficultyRatings)) >=
          parseInt(advancedSearchChoices.difficultyRating.slice(0, -1))
      ));

    // Multiple choice filters
    advancedSearchChoices.years.length > 0 &&
      (filteredExams = filteredExams.filter((exam) => advancedSearchChoices.years.some((year) => exam.year === year)));

    advancedSearchChoices.semesters.length > 0 &&
      (filteredExams = filteredExams.filter((exam) =>
        advancedSearchChoices.semesters
          .map((semester) => (semester === "א" ? 1 : semester === "ב" ? 2 : 3))
          .some((semester) => exam.semester === semester)
      ));

    advancedSearchChoices.terms.length > 0 &&
      (filteredExams = filteredExams.filter((exam) =>
        advancedSearchChoices.terms
          .map((term) => (term === "א" ? 1 : term === "ב" ? 2 : 3))
          .some((term) => exam.term === term)
      ));

    advancedSearchChoices.lecturers.length > 0 &&
      (filteredExams = filteredExams.filter((exam) =>
        advancedSearchChoices.lecturers.some((lecturer) => exam.lecturers.includes(lecturer))
      ));

    advancedSearchChoices.tags.length > 0 &&
      (filteredExams = filteredExams.filter((exam) =>
        advancedSearchChoices.tags.some((tag) => exam.tags.includes(tag))
      ));

    setFilteredExams(filteredExams);
    setShowExams(true);
  };

  // Initial fetch of faculties
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Fetch departments and courses according to the chosen faculty
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

  // Fetch course attributes and exams according to the chosen course
  useEffect(() => {
    if (chosenCategories.course) {
      fetchCourseAttributesAndExams(chosenCategories.course._id);
    } else {
      clearAdvancedFilters();
    }
  }, [chosenCategories.course]);

  // Update advanced search lists based on the fetched course exams
  useEffect(() => {
    updateAdvancedSearchLists();
  }, [courseExams]);

  return (
    <div className="filter-bar">
      <div id="mandatory-filters-row" className="filter-bar-row">
        {/* Mandatory filters */}
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
        {/* Optional filters */}
        <div className={"advanced-filters" + (showAdvancedFilters ? " show" : "")}>
          <FilterDropdown
            label="שנה"
            options={advancedSearchLists.years}
            setOptions={(options) => setAdvancedSearchLists({ ...advancedSearchLists, years: options })}
            value={advancedSearchChoices.years}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, years: val })}
            isAvailable={advancedSearchLists.years.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={true}
            isMultiChoice={true}
          />
          <FilterDropdown
            label="סמסטר"
            options={advancedSearchLists.semesters}
            setOptions={(options) => setAdvancedSearchLists({ ...advancedSearchLists, semesters: options })}
            value={advancedSearchChoices.semesters}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, semesters: val })}
            isAvailable={advancedSearchLists.semesters.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isMultiChoice={true}
          />
          <FilterDropdown
            label="מועד"
            options={advancedSearchLists.terms}
            setOptions={(options) => setAdvancedSearchLists({ ...advancedSearchLists, terms: options })}
            value={advancedSearchChoices.terms}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, terms: val })}
            isAvailable={advancedSearchLists.terms.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
            isMultiChoice={true}
          />
          <FilterDropdown
            label="סוג"
            options={advancedSearchLists.types}
            value={advancedSearchChoices.type}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, type: val })}
            isAvailable={advancedSearchLists.types.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
          />
          <FilterDropdown
            label="ציון מינימלי"
            options={advancedSearchLists.minGrades}
            value={advancedSearchChoices.minGrade}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, minGrade: val })}
            isAvailable={advancedSearchLists.minGrades.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
          />
          <FilterDropdown
            label="דרגת קושי"
            options={advancedSearchLists.difficultyRatings}
            value={advancedSearchChoices.difficultyRating}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, difficultyRating: val })}
            isAvailable={advancedSearchLists.difficultyRatings.length > 0}
            size={"s"}
            isPending={dropdownPendings.advancedFilters}
          />
          <FilterDropdown
            label="מרצים"
            options={advancedSearchLists.lecturers}
            setOptions={(options) => setAdvancedSearchLists({ ...advancedSearchLists, lecturers: options })}
            value={advancedSearchChoices.lecturers}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, lecturers: val })}
            isAvailable={advancedSearchLists.lecturers.length > 0}
            size={"m"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={true}
            isMultiChoice={true}
          />
          <FilterDropdown
            label="תגיות"
            options={advancedSearchLists.tags}
            setOptions={(options) => setAdvancedSearchLists({ ...advancedSearchLists, tags: options })}
            value={advancedSearchChoices.tags}
            setValue={(val) => setAdvancedSearchChoices({ ...advancedSearchChoices, tags: val })}
            isAvailable={advancedSearchLists.tags.length > 0}
            size={"m"}
            isPending={dropdownPendings.advancedFilters}
            isSearchable={true}
            isMultiChoice={true}
          />
        </div>
        <div className="filter-bar-buttons-row">
          {/* Filter buttons */}
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
            className={"filter-bar-button" + (examsPending ? " pending" : "")}
            id="filter-bar-search-button"
            onClick={filterAndSearchExams}
          >
            {examsPending ? <div className="lds-dual-ring"></div> : "חיפוש מבחנים"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
