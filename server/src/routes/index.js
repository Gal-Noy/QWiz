import express from "express";
import examsRouter from "./examsRoute.js";

const router = express.Router();

router.use("/exams", examsRouter);

export default router;
