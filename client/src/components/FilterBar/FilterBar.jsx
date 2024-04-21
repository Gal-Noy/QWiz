import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { toast } from "react-custom-alert";
import "./FilterBar.css";

/**
 * Represents the FilterBar component.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setQuery - The function to set the query for fetching exams.
 * @param {Function} props.setShowExams - The function to set the visibility of exams.
 * @returns {JSX.Element} The FilterBar component.
 */
function FilterBar(props) {
  const { setQuery, setShowExams } = props;

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
        handleResult(res, 200, () => setCategoriesLists({ faculties: res.data.data, departments: [], courses: [] }))
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
      .get(`/categories/departments?faculty=${facultyId}`)
      .then((res) =>
        handleResult(res, 200, () =>
          setCategoriesLists({ ...categoriesLists, departments: res.data.data, courses: [] })
        )
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
      .get(`/categories/courses?department=${departmentId}`)
      .then((res) => handleResult(res, 200, () => setCategoriesLists({ ...categoriesLists, courses: res.data.data })))
      .catch((err) => handleError(err))
      .finally(() =>
        setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false })
      );
  };

  /**
   * Fetches course attributes (lecturers, tags) and course exams for a given courseId.
   *
   * @async
   * @function fetchCourseMetadata
   * @param {string} courseId - The ID of the course.
   * @returns {Promise<void>} - A Promise that resolves when the data is fetched successfully.
   */
  const fetchCourseMetadata = async (courseId) => {
    setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: true });

    // Fetch course attributes (lecturers, tags)
    await axiosInstance
      .get(`/categories/course/${courseId}/metadata`)
      .then((res) =>
        handleResult(res, 200, () => {
          const { examsCount, years, semesters, terms, types, grades, difficultyRatings, lecturers, tags } = res.data;
          setAdvancedSearchLists({
            years,
            semesters: semesters.map((s) => (s === 1 ? "א" : s === 2 ? "ב" : "קיץ")),
            terms: terms.map((t) => (t === 1 ? "א" : t === 2 ? "ב" : "ג")),
            types: types.map((t) => (t === "test" ? "מבחן" : "בוחן")),
            minGrades: [...new Set(grades.map((grade) => `${Math.floor(grade / 10) * 10}+`))],
            difficultyRatings: [...new Set(difficultyRatings.map((rating) => `${rating}+`))],
            lecturers,
            tags,
          });
        })
      )
      .catch((err) => handleError(err))
      .finally(() =>
        setDropdownPendings({ faculties: false, departments: false, courses: false, advancedFilters: false })
      );
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
      fetchCourseMetadata(chosenCategories.course._id);
    } else {
      clearAdvancedFilters();
    }
  }, [chosenCategories.course]);

  const handleSearchClick = () => {
    if (!chosenCategories.course) return toast.warning("יש לבחור קורס לפני החיפוש.");

    let query = `/exams?course=${chosenCategories.course._id}`;
    if (advancedSearchChoices.years.length > 0) query += `&years=${advancedSearchChoices.years.join(",")}`;
    if (advancedSearchChoices.semesters.length > 0)
      query += `&semesters=${advancedSearchChoices.semesters
        .map((s) => (s === "א" ? 1 : s === "ב" ? 2 : 3))
        .join(",")}`;
    if (advancedSearchChoices.terms.length > 0)
      query += `&terms=${advancedSearchChoices.terms.map((t) => (t === "א" ? 1 : t === "ב" ? 2 : 3)).join(",")}`;
    if (advancedSearchChoices.type) query += `&type=${advancedSearchChoices.type === "מבחן" ? "test" : "בוחן"}`;
    if (advancedSearchChoices.minGrade) query += `&minGrade=${advancedSearchChoices.minGrade?.split("+")[0]}`;
    if (advancedSearchChoices.difficultyRating)
      query += `&difficultyRating=${advancedSearchChoices.difficultyRating?.split("+")[0]}`;
    if (advancedSearchChoices.lecturers.length > 0) query += `&lecturers=${advancedSearchChoices.lecturers.join(",")}`;
    if (advancedSearchChoices.tags.length > 0) query += `&tags=${advancedSearchChoices.tags.join(",")}`;

    setQuery(query);
    setShowExams(true);
  };

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
          <div
            className={"filter-bar-button" + (dropdownPendings.advancedFilters ? " pending" : "")}
            id="filter-bar-search-button"
            onClick={handleSearchClick}
          >
            {dropdownPendings.advancedFilters ? <div className="lds-dual-ring"></div> : "חיפוש מבחנים"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
