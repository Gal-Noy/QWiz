import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import "./FilterBar.css";
import axios from "axios";

function FilterBar(props) {
  const { filters, setFilters } = props;
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const fetchFaculties = async () =>
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculties`)
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error(err));

  const fetchDepartmentsByFaculty = async (facultyId) =>
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculty/${facultyId}/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));

  const fetchCoursesByDepartment = async (departmentId) =>
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/department/${departmentId}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    setDepartments([]);
    setCourses([]);
    if (filters.faculty) {
      fetchDepartmentsByFaculty(filters.faculty._id);
    }
  }, [filters.faculty]);

  useEffect(() => {
    setCourses([]);
    if (filters.department) {
      fetchCoursesByDepartment(filters.department._id);
    }
  }, [filters.department]);

  useEffect(() => {
    if (filters.course) {
      fetchCourseExams(filters.course._id);
    }
  }, [filters.course]);

  return (
    <div className="filter-bar">
      <div className="filter-bar-row">
        <FilterDropdown
          label="פקולטה"
          options={faculties}
          value={filters.faculty}
          setValue={(val) => setFilters({ ...filters, faculty: val })}
          isAvailable={faculties.length > 0}
        />
        <FilterDropdown
          label="מחלקה"
          options={departments}
          value={filters.department}
          setValue={(val) => setFilters({ ...filters, department: val })}
          isAvailable={departments.length > 0}
        />
        <FilterDropdown
          label="קורס"
          options={courses}
          value={filters.course}
          setValue={(val) => setFilters({ ...filters, course: val })}
          isAvailable={courses.length > 0}
        />
      </div>
      <div className="filter-bar-row">
        <FilterDropdown
          label="מרצים"
          options={lecturers}
          value={filters.lecturers}
          setValue={(val) => setFilters({ ...filters, lecturers: val })}
          isAvailable={lecturers.length > 0}
        />
        <FilterDropdown
          label="שנה"
          options={lecturers}
          value={filters.lecturers}
          setValue={(val) => setFilters({ ...filters, lecturers: val })}
          isAvailable={lecturers.length > 0}
        />
        <FilterDropdown
          label="סמסטר"
          options={lecturers}
          value={filters.lecturers}
          setValue={(val) => setFilters({ ...filters, lecturers: val })}
          isAvailable={lecturers.length > 0}
        />
      </div>
    </div>
  );
}

export default FilterBar;
