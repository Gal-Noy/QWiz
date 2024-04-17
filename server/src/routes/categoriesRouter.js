import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const categoriesRouter = express.Router();
categoriesRouter.use(authenticateToken);

////////////////////////////////////////// FACULTIES //////////////////////////////////////////

// GET: get all faculties
categoriesRouter.get("/faculties", categoriesController.getFaculties);

// GET: get faculty by id
categoriesRouter.get("/faculty/:id", categoriesController.getFacultyById);

// POST: create a new faculty
categoriesRouter.post("/faculty", authenticateAdmin, categoriesController.createFaculty);

// PUT: update faculty by id
categoriesRouter.put("/faculty/:id", authenticateAdmin, categoriesController.updateFaculty);

// DELETE: delete faculty by id
categoriesRouter.delete("/faculty/:id", authenticateAdmin, categoriesController.deleteFaculty);

// GET: get faculty's departments
categoriesRouter.get("/faculty/:id/departments", categoriesController.getFacultyDepartments);

////////////////////////////////////////// DEPARTMENTS //////////////////////////////////////////

// GET: get all departments
categoriesRouter.get("/departments", categoriesController.getDepartments);

// GET: get department by id
categoriesRouter.get("/department/:id", categoriesController.getDepartmentById);

// POST: create a new department
categoriesRouter.post("/department", authenticateAdmin, categoriesController.createDepartment);

// PUT: update department by id
categoriesRouter.put("/department/:id", authenticateAdmin, categoriesController.updateDepartment);

// DELETE: delete department by id
categoriesRouter.delete("/department/:id", authenticateAdmin, categoriesController.deleteDepartment);

// GET: get department's courses
categoriesRouter.get("/department/:id/courses", categoriesController.getDepartmentCourses);

////////////////////////////////////////// COURSES //////////////////////////////////////////

// GET: get all courses
categoriesRouter.get("/courses", categoriesController.getCourses);

// GET: get course by id
categoriesRouter.get("/course/:id", categoriesController.getCourseById);

// POST: create a new course
categoriesRouter.post("/course", authenticateAdmin, categoriesController.createCourse);

// PUT: update course by id
categoriesRouter.put("/course/:id", authenticateAdmin, categoriesController.updateCourse);

// DELETE: delete course by id
categoriesRouter.delete("/course/:id", authenticateAdmin, categoriesController.deleteCourse);

export default categoriesRouter;
