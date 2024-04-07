import express from "express";
import usersRouter from "./usersRoute.js";
import authRouter from "./authRoute.js";
import infoRouter from "./infoRoute.js";
import examsRouter from "./examsRoute.js";
import threadsRouter from "./threadsRoute.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/info", infoRouter);
router.use("/exams", examsRouter);
router.use("/threads", threadsRouter);

export default router;
