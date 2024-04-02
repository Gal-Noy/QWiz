import express from "express";
import infoController from "../controllers/infoController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const infoRouter = express.Router();
infoRouter.use(authenticateToken);

// Faculties

// GET: get all faculties
infoRouter.get("/faculties", infoController.getFaculties);

// GET: get faculty by id
infoRouter.get("/faculty/:id", infoController.getFacultyById);

// POST: create a new faculty
infoRouter.post("/faculty", infoController.createFaculty);

// PUT: update faculty by id
infoRouter.put("/faculty/:id", infoController.updateFaculty);

// DELETE: delete faculty by id
infoRouter.delete("/faculty/:id", infoController.deleteFaculty);

// Departments

// GET: get all departments
infoRouter.get("/departments", infoController.getDepartments);

// GET: get department by id
infoRouter.get("/department/:id", infoController.getDepartmentById);

// POST: create a new department
infoRouter.post("/department", infoController.createDepartment);

// PUT: update department by id
infoRouter.put("/department/:id", infoController.updateDepartment);

// DELETE: delete department by id
infoRouter.delete("/department/:id", infoController.deleteDepartment);

// Courses

// GET: get all courses
infoRouter.get("/courses", infoController.getCourses);

// GET: get course by id
infoRouter.get("/course/:id", infoController.getCourseById);

// POST: create a new course
infoRouter.post("/course", infoController.createCourse);

// PUT: update course by id
infoRouter.put("/course/:id", infoController.updateCourse);

// DELETE: delete course by id
infoRouter.delete("/course/:id", infoController.deleteCourse);

// Filters

// GET: get faculty's departments
infoRouter.get("/faculty/:id/departments", infoController.getFacultyDepartments);

// GET: get department's courses
infoRouter.get("/department/:id/courses", infoController.getDepartmentCourses);

export default infoRouter;
