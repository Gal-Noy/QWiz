import express from "express";
import infoController from "../controllers/infoController.js";

const infoRouter = express.Router();

// GET: get all faculties
infoRouter.get("/faculties", infoController.getFaculties);

// GET: get departments by faculty
infoRouter.get("/departments/:faculty", infoController.getDepartmentsByFaculty);

// GET: get courses by department
infoRouter.get("/courses/:department", infoController.getCoursesByDepartment);

export default infoRouter;