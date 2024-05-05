import express from "express";
import examsController from "../controllers/examsController.js";
import multer from "multer";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { validateIdParam } from "../middleware/examsMiddleware.js";
import { PSMiddleware } from "../middleware/PSMiddleware.js";

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const examsRouter = express.Router();
examsRouter.use(authenticateToken);

// GET: get exams
examsRouter.get("/", PSMiddleware, examsController.getExams);

// GET: get exam by id
examsRouter.get("/:id", validateIdParam, examsController.getExamById);

// POST: create a new exam
examsRouter.post("/", upload.single("file"), examsController.createExam);

// PUT: update exam by id (ADMIN ONLY)
examsRouter.put("/:id", authenticateAdmin, examsController.updateExam);

// DELETE: delete exam by id (ADMIN ONLY)
examsRouter.delete("/:id", authenticateAdmin, examsController.deleteExam);

// GET: get exam presigned URL by id
examsRouter.get("/:id/presigned", examsController.getPresignedUrl);

// POST: rate exam by id
examsRouter.post("/:id/rate", examsController.rateExam);

export default examsRouter;
