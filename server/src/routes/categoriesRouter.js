import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { PSMiddleware } from "../middleware/PSMiddleware.js";

const categoriesRouter = express.Router();
categoriesRouter.use(authenticateToken);

////////////////////////////////////////// FACULTIES //////////////////////////////////////////

// GET: get faculties
categoriesRouter.get("/faculties", PSMiddleware, categoriesController.getFaculties);

// GET: get faculty by id
categoriesRouter.get("/faculty/:id", categoriesController.getFacultyById);

// POST: create a new faculty (ADMIN ONLY)
categoriesRouter.post("/faculty", authenticateAdmin, categoriesController.createFaculty);

// PUT: update faculty by id (ADMIN ONLY)
categoriesRouter.put("/faculty/:id", authenticateAdmin, categoriesController.updateFaculty);

// DELETE: delete faculty by id (ADMIN ONLY)
categoriesRouter.delete("/faculty/:id", authenticateAdmin, categoriesController.deleteFaculty);

////////////////////////////////////////// DEPARTMENTS //////////////////////////////////////////

// GET: get departments
categoriesRouter.get("/departments", PSMiddleware, categoriesController.getDepartments);

// GET: get department by id
categoriesRouter.get("/department/:id", categoriesController.getDepartmentById);

// POST: create a new department (ADMIN ONLY)
categoriesRouter.post("/department", authenticateAdmin, categoriesController.createDepartment);

// PUT: update department by id (ADMIN ONLY)
categoriesRouter.put("/department/:id", authenticateAdmin, categoriesController.updateDepartment);

// DELETE: delete department by id (ADMIN ONLY)
categoriesRouter.delete("/department/:id", authenticateAdmin, categoriesController.deleteDepartment);

////////////////////////////////////////// COURSES //////////////////////////////////////////

// GET: get courses
categoriesRouter.get("/courses", PSMiddleware, categoriesController.getCourses);

// GET: get course by id
categoriesRouter.get("/course/:id", categoriesController.getCourseById);

// POST: create a new course (ADMIN ONLY)
categoriesRouter.post("/course", authenticateAdmin, categoriesController.createCourse);

// PUT: update course by id (ADMIN ONLY)
categoriesRouter.put("/course/:id", authenticateAdmin, categoriesController.updateCourse);

// DELETE: delete course by id (ADMIN ONLY)
categoriesRouter.delete("/course/:id", authenticateAdmin, categoriesController.deleteCourse);

// GET: get course's metadata
categoriesRouter.get("/course/:id/metadata", categoriesController.getCourseMetadata);

export default categoriesRouter;
