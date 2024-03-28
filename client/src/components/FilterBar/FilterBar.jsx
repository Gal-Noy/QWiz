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

  const fetchLecturersByCourse = async (courseId) =>
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/course/${courseId}/lecturers`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (filters.faculty) {
      fetchDepartmentsByFaculty(filters.faculty);
    }
  }, [filters.faculty]);

  useEffect(() => {
    if (filters.department) {
      fetchCoursesByDepartment(filters.department);
    }
  }, [filters.department]);

  useEffect(() => {
    if (filters.course) {
      fetchLecturersByCourse(filters.course);
    }
  }, [filters.course]);

  return (
    <div className="filter-bar">
      <div className="filter-bar-form-row">
        <FilterDropdown
          label="פקולטה"
          options={faculties}
          value={filters.faculty}
          setValue={(val) => setFilters({ ...filters, faculty: val })}
        />
        <FilterDropdown
          label="מחלקה"
          options={departments}
          value={filters.department}
          setValue={(val) => setFilters({ ...filters, department: val })}
        />
        <FilterDropdown
          label="קורס"
          options={courses}
          value={filters.course}
          setValue={(val) => setFilters({ ...filters, course: val })}
        />
      </div>
      <div className="filter-bar-form-row">
        {/* <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown /> */}
      </div>
    </div>
  );
}

export default FilterBar;
