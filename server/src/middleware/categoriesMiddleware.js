import { Department, Course } from "../models/categoriesModels.js";
import { Exam } from "../models/examModel.js";

/**
 * Middleware to delete a faculty
 * @async
 * @function deleteFaculty
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteFaculty = async function (next) {
  const facultyId = this._conditions._id;

  try {
    await Department.deleteMany({ faculty: facultyId });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete multiple faculties
 *
 * @async
 * @function deleteFaculties
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteFaculties = async function (next) {
  const facultiesToDelete = await this.model.find(this.getQuery());
  const facultyIds = facultiesToDelete.map((faculty) => faculty._id);

  try {
    await Department.deleteMany({ faculty: { $in: facultyIds } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete a department
 *
 * @async
 * @function deleteDepartment
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteDepartment = async function (next) {
  const departmentId = this._conditions._id;

  try {
    await Course.deleteMany({ department: departmentId });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete multiple departments
 *
 * @async
 * @function deleteDepartments
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteDepartments = async function (next) {
  const departmentsToDelete = await this.model.find(this.getQuery());
  const departmentIds = departmentsToDelete.map((department) => department._id);

  try {
    await Course.deleteMany({ department: { $in: departmentIds } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to populate the department
 *
 * @function populateDepartment
 * @param {Function} next - Callback function
 * @returns {void}
 */
const populateDepartment = function (next) {
  this.populate("faculty", "name");
  next();
};

/**
 * Middleware to delete a course
 *
 * @async
 * @function deleteCourse
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteCourse = async function (next) {
  const courseId = this._conditions._id;

  try {
    await Exam.deleteMany({ course: courseId });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete multiple courses
 *
 * @async
 * @function deleteCourses
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteCourses = async function (next) {
  const coursesToDelete = await this.model.find(this.getQuery());
  const courseIds = coursesToDelete.map((course) => course._id);

  try {
    await Exam.deleteMany({ course: { $in: courseIds } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to populate the course
 *
 * @function populateCourse
 * @param {Function} next - Callback function
 * @returns {void}
 */
const populateCourse = function (next) {
  this.populate("department", "name");
  next();
};

export {
  deleteFaculty,
  deleteFaculties,
  deleteDepartment,
  deleteDepartments,
  populateDepartment,
  deleteCourse,
  deleteCourses,
  populateCourse,
};
