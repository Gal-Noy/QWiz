import express from "express";
import infoController from "../controllers/infoController.js";

const infoRouter = express.Router();

// GET: get all faculties
infoRouter.get("/faculties", infoController.getFaculties);

// GET: get faculty by id
infoRouter.get("/faculty/:id", infoController.getFacultyById);

// GET: get all departments
infoRouter.get("/departments", infoController.getDepartments);

// GET: get department by id
infoRouter.get("/department/:id", infoController.getDepartmentById);

// GET: get all courses
infoRouter.get("/courses", infoController.getCourses);

// GET: get course by id
infoRouter.get("/course/:id", infoController.getCourseById);

// GET: get faculty's departments
infoRouter.get("/faculty/:id/departments", infoController.getFacultyDepartments);

// GET: get department's courses
infoRouter.get("/department/:id/courses", infoController.getDepartmentCourses);

// GET: get course's lecturers
infoRouter.get("/course/:id/lecturers", infoController.getCourseLecturers);

export default infoRouter;
