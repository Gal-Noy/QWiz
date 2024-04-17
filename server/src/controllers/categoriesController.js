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
   *
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
   * @throws {FacultyNotFoundError} If the faculty is not found.
   * @throws {Error} If an error occurs while fetching the faculty.
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
   * Only admins can create faculties.
   *
   * @async
   * @function createFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty} The created faculty.
   * @throws {Error} If an error occurs while creating the faculty.
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
   * Only admins can update faculties.
   *
   * @async
   * @function updateFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Faculty} The updated faculty.
   * @throws {FacultyNotFoundError} If the faculty is not found.
   * @throws {Error} If an error occurs while updating the faculty.
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
   * Only admins can delete faculties.
   *
   * @async
   * @function deleteFaculty
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the faculty (message).
   * @throws {FacultyNotFoundError} If the faculty is not found.
   * @throws {Error} If an error occurs while deleting the faculty.
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
   * @throws {Error} If an error occurs while fetching the departments.
   * @throws {FacultyNotFoundError} If the faculty is not found.
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
   * @throws {DepartmentNotFoundError} If the department is not found.
   * @throws {Error} If an error occurs while fetching the departments.
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
   * @throws {DepartmentNotFoundError} If the department is not found.
   * @throws {Error} If an error occurs while fetching the department.
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
   * Only admins can create departments.
   *
   * @async
   * @function createDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department} The created department.
   * @throws {Error} If an error occurs while creating the department.
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
   * Only admins can update departments.
   *
   * @async
   * @function updateDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Department} The updated department.
   * @throws {DepartmentNotFoundError} If the department is not found.
   * @throws {Error} If an error occurs while updating the department.
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
   * Only admins can delete departments.
   *
   * @async
   * @function deleteDepartment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the department (message).
   * @throws {DepartmentNotFoundError} If the department is not found.
   * @throws {Error} If an error occurs while deleting the department.
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
   * @throws {Error} If an error occurs while fetching the courses.
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
   * @throws {Error} If an error occurs while fetching the courses.
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
   * @throws {CourseNotFoundError} If the course is not found.
   * @throws {Error} If an error occurs while fetching the course.
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
   * Only admins can create courses.
   *
   * @async
   * @function createCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course} The created course.
   * @throws {Error} If an error occurs while creating the course.
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
   * Only admins can update courses.
   *
   * @async
   * @function updateCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Course} The updated course.
   * @throws {CourseNotFoundError} If the course is not found.
   * @throws {Error} If an error occurs while updating the course.
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
   * Only admins can delete courses.
   *
   * @async
   * @function deleteCourse
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of deleting the course (message).
   * @throws {CourseNotFoundError} If the course is not found.
   * @throws {Error} If an error occurs while deleting the course.
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
