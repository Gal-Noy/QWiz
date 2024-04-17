import { Faculty, Department, Course } from "../models/categoriesModels.js";

/**
 * Controller for handling faculty, department and course operations.
 */
const categoriesController = {
  ////////////////////////////////////////// FACULTIES //////////////////////////////////////////

  /**
   * Gets all faculties.
   *
   * @async
   * @function getFaculties
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty[]} The faculties.
   */
  getFaculties: async (req, res) => {
    try {
      const faculties = await Faculty.find();

      return res.json(faculties);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Gets a faculty by its ID.
   *
   * @async
   * @function getFacultyById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty} The faculty.
   */
  getFacultyById: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Creates a faculty.
   *
   * @async
   * @function createFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty} The created faculty.
   */
  createFaculty: async (req, res) => {
    try {
      const faculty = new Faculty(req.body);

      await faculty.save();
      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Updates a faculty.
   *
   * @async
   * @function updateFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty} The updated faculty.
   */
  updateFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      faculty.set(req.body);
      await faculty.save();

      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Deletes a faculty.
   *
   * @async
   * @function deleteFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the faculty (message).
   */
  deleteFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findByIdAndDelete(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      return res.json({ message: "Faculty deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Gets all departments of a faculty.
   *
   * @async
   * @function getFacultyDepartments
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department[]} The departments of the faculty.
   */
  getFacultyDepartments: async (req, res) => {
    try {
      const departments = await Department.find({ faculty: req.params.id });

      return res.json(departments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  ////////////////////////////////////////// DEPARTMENTS //////////////////////////////////////////

  /**
   * Gets all departments.
   *
   * @async
   * @function getDepartments
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department[]} The departments.
   */
  getDepartments: async (req, res) => {
    try {
      const departments = await Department.find();

      return res.json(departments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Gets a department by its ID.
   *
   * @async
   * @function getDepartmentById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department} The department.
   */
  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Creates a department.
   *
   * @async
   * @function createDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department} The created department.
   */
  createDepartment: async (req, res) => {
    try {
      const department = new Department(req.body);

      await department.save();

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Updates a department.
   *
   * @async
   * @function updateDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department} The updated department.
   */
  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      department.set(req.body);
      await department.save();

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Deletes a department.
   *
   * @async
   * @function deleteDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the department (message).
   */
  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      return res.json({ message: "Department deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Gets all courses of a department.
   *
   * @async
   * @function getDepartmentCourses
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course[]} The courses of the department.
   */
  getDepartmentCourses: async (req, res) => {
    try {
      const courses = await Course.find({ department: req.params.id });

      return res.json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  ////////////////////////////////////////// COURSES //////////////////////////////////////////

  /**
   * Gets all courses.
   *
   * @async
   * @function getCourses
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course[]} The courses.
   */
  getCourses: async (req, res) => {
    try {
      const courses = await Course.find();

      return res.json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Gets a course by its ID.
   *
   * @async
   * @function getCourseById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course} The course.
   */
  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Creates a course.
   *
   * @async
   * @function createCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course} The created course.
   */
  createCourse: async (req, res) => {
    try {
      const course = new Course(req.body);

      await course.save();

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Updates a course.
   *
   * @async
   * @function updateCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course} The updated course.
   */
  updateCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      course.set(req.body);
      await course.save();

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Deletes a course.
   *
   * @async
   * @function deleteCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the course (message).
   */
  deleteCourse: async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      return res.json({ message: "Course deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default categoriesController;
