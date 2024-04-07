import express from "express";
import infoController from "../controllers/infoController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const infoRouter = express.Router();
infoRouter.use(authenticateToken);

// Faculties

// GET: get all faculties
infoRouter.get("/faculties", infoController.getFaculties);

// GET: get faculty by id
infoRouter.get("/faculty/:id", infoController.getFacultyById);

// POST: create a new faculty
infoRouter.post("/faculty", authenticateAdmin, infoController.createFaculty);

// PUT: update faculty by id
infoRouter.put("/faculty/:id", authenticateAdmin, infoController.updateFaculty);

// DELETE: delete faculty by id
infoRouter.delete("/faculty/:id", authenticateAdmin, infoController.deleteFaculty);

// Departments

// GET: get all departments
infoRouter.get("/departments", infoController.getDepartments);

// GET: get department by id
infoRouter.get("/department/:id", infoController.getDepartmentById);

// POST: create a new department
infoRouter.post("/department", authenticateAdmin, infoController.createDepartment);

// PUT: update department by id
infoRouter.put("/department/:id", authenticateAdmin, infoController.updateDepartment);

// DELETE: delete department by id
infoRouter.delete("/department/:id", authenticateAdmin, infoController.deleteDepartment);

// Courses

// GET: get all courses
infoRouter.get("/courses", infoController.getCourses);

// GET: get course by id
infoRouter.get("/course/:id", infoController.getCourseById);

// POST: create a new course
infoRouter.post("/course", authenticateAdmin, infoController.createCourse);

// PUT: update course by id
infoRouter.put("/course/:id", authenticateAdmin, infoController.updateCourse);

// DELETE: delete course by id
infoRouter.delete("/course/:id", authenticateAdmin, infoController.deleteCourse);

// Filters

// GET: get faculty's departments
infoRouter.get("/faculty/:id/departments", infoController.getFacultyDepartments);

// GET: get department's courses
infoRouter.get("/department/:id/courses", infoController.getDepartmentCourses);

export default infoRouter;
