import { Department, Course } from "../models/categoriesModels.js";
import { Exam } from "../models/examModel.js";

const deleteFaculty = async function (next) {
  const facultyId = this._conditions._id;

  try {
    await Department.deleteMany({ faculty: facultyId });

    next();
  } catch (error) {
    next(error);
  }
};

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

const deleteDepartment = async function (next) {
  const departmentId = this._conditions._id;

  try {
    await Course.deleteMany({ department: departmentId });

    next();
  } catch (error) {
    next(error);
  }
};

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

const populateDepartment = function (next) {
  this.populate("faculty", "name");
  next();
};

const deleteCourse = async function (next) {
  const courseId = this._conditions._id;

  try {
    await Exam.deleteMany({ course: courseId });

    next();
  } catch (error) {
    next(error);
  }
};

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
