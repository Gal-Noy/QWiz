import express from "express";
import examsController from "../controllers/examsController.js";
import multer from "multer";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const examsRouter = express.Router();
examsRouter.use(authenticateToken);

// GET: get all exams
examsRouter.get("/", authenticateAdmin, examsController.getAllExams);

// POST: create a new exam
examsRouter.post("/", upload.single("file"), examsController.createExam);

// GET: get uploaded exams
examsRouter.get("/uploaded", examsController.getUploadedExams);

// GET: get favorite exams
examsRouter.get("/favorites", examsController.getFavoriteExams);

// GET: get exams by course id
examsRouter.get("/course/:id", examsController.getCourseExams);

// GET: get exam by id
examsRouter.get("/:id", examsController.getExamById);

// GET: get exam presigned URL by id
examsRouter.get("/:id/presigned", examsController.getPresignedUrl);

// POST: add exam to favorites
examsRouter.post("/favorites/:id", examsController.addFavoriteExam);

// DELETE: remove exam from favorites
examsRouter.delete("/favorites/:id", examsController.removeFavoriteExam);

// POST: rate exam by id
examsRouter.post("/:id/rate", examsController.rateExam);

// POST: add tags to exam by id
examsRouter.post("/:id/tags", examsController.addTags);

// PUT: update exam by id
examsRouter.put("/:id", authenticateAdmin, examsController.updateExam);

// DELETE: delete exam by id
examsRouter.delete("/:id", authenticateAdmin, examsController.deleteExam);

export default examsRouter;
