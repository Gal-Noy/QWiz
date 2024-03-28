import express from "express";
import examsController from "../controllers/examsController.js";

const examsRouter = express.Router();

// GET: get all exams
examsRouter.get("/", examsController.getAllExams);

// POST: create a new exam
examsRouter.post("/", examsController.createExam);

// GET: filter exams
examsRouter.get("/filter", examsController.filterExams);

// GET: get last 10 exams
examsRouter.get("/last/:page?", examsController.getLastExams);

// GET: get exam by id
examsRouter.get("/:id", examsController.getExamById);

// PUT: update exam by id
examsRouter.put("/:id", examsController.updateExam);

// DELETE: delete exam by id
examsRouter.delete("/:id", examsController.deleteExam);

export default examsRouter;
