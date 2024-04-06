import express from "express";
import examsController from "../controllers/examsController.js";
import multer from "multer";
import { authenticateToken } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const examsRouter = express.Router();
examsRouter.use(authenticateToken);

// GET: get all exams
examsRouter.get("/", examsController.getAllExams);

// POST: create a new exam
examsRouter.post("/", upload.single("file"), examsController.createExam);

// GET: get uploaded exams
examsRouter.get("/uploaded", examsController.getUploadedExams);

// GET: get favorite exams
examsRouter.get("/favorites", examsController.getFavoriteExams);

// POST: add exam to favorites
examsRouter.post("/favorites", examsController.addFavoriteExam);

// DELETE: remove exam from favorites
examsRouter.delete("/favorites/:id", examsController.removeFavoriteExam);

// GET: get exams by course id
examsRouter.get("/course/:id", examsController.getCourseExams);

// GET: get exam by id
examsRouter.get("/:id", examsController.getExamById);

// PUT: update exam by id
examsRouter.put("/:id", examsController.updateExam);

// DELETE: delete exam by id
examsRouter.delete("/:id", examsController.deleteExam);

// POST: rate exam by id
examsRouter.post("/:id/rate", examsController.rateExam);

// GET: get exam presigned URL by id
examsRouter.get("/:id/presigned", examsController.getPresignedUrl);

export default examsRouter;
