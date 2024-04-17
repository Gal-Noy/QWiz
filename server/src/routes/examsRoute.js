import express from "express";
import examsController from "../controllers/examsController.js";
import multer from "multer";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { validateIdParam } from "../middleware/examsMiddleware.js";

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const examsRouter = express.Router();
examsRouter.use(authenticateToken);

/////////////////////////// EXAMS CRUD ///////////////////////////

// GET: get all exams (ADMIN ONLY)
examsRouter.get("/", authenticateAdmin, examsController.getAllExams);

// GET: get exam by id
examsRouter.get("/:id", validateIdParam, examsController.getExamById);

// POST: create a new exam
examsRouter.post("/", upload.single("file"), examsController.createExam);

// PUT: update exam by id (ADMIN ONLY)
examsRouter.put("/:id", authenticateAdmin, examsController.updateExam);

// DELETE: delete exam by id (ADMIN ONLY)
examsRouter.delete("/:id", authenticateAdmin, examsController.deleteExam);

/////////////////////////// EXAMS SEARCH ///////////////////////////

// GET: get exams by user id (my exams)
examsRouter.get("/user/:id", authenticateAdmin, examsController.getUserExams);

// GET: get exams by course id
examsRouter.get("/course/:id", examsController.getCourseExams);

// GET: get uploaded exams
examsRouter.get("/uploaded", examsController.getUploadedExams);

// GET: get favorite exams
examsRouter.get("/favorites", examsController.getFavoriteExams);

/////////////////////////// EXAMS ACTIONS ///////////////////////////

// GET: get exam presigned URL by id
examsRouter.get("/:id/presigned", examsController.getPresignedUrl);

// POST: add exam to favorites
examsRouter.post("/favorites/:id", examsController.addFavoriteExam);

// DELETE: remove exam from favorites
examsRouter.delete("/favorites/:id", examsController.removeFavoriteExam);

// POST: rate exam by id
examsRouter.post("/:id/rate", examsController.rateExam);

export default examsRouter;
