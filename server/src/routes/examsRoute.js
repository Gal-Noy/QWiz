import express from "express";
import examsController from "../controllers/examsController.js";
import multer from "multer";

const examsRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// GET: get all exams
examsRouter.get("/", examsController.getAllExams);

// POST: create a new exam
examsRouter.post("/", upload.single("file"), examsController.createExam);

// GET: filter exams
examsRouter.get("/filter", examsController.filterExams);

// GET: get exams by course id
examsRouter.get("/course/:id", examsController.getCourseExams);

// GET: get last 10 exams
examsRouter.get("/last/:page?", examsController.getLastExams);

// GET: get exam by id
examsRouter.get("/:id", examsController.getExamById);

// PUT: update exam by id
examsRouter.put("/:id", examsController.updateExam);

// DELETE: delete exam by id
examsRouter.delete("/:id", examsController.deleteExam);

export default examsRouter;
