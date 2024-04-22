import express from "express";
import threadsController from "../controllers/threadsController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  validateIdParam,
  threadsUpdateMiddleware,
  commentsCreateMiddleware,
  commentsUpdateMiddleware,
} from "../middleware/threadsMiddleware.js";
import { PSMiddleware } from "../middleware/PSMiddleware.js";

const threadsRouter = express.Router();
threadsRouter.use(authenticateToken);

///////////////////////// THREADS /////////////////////////

// GET: get threads
threadsRouter.get("/", PSMiddleware, threadsController.getThreads);

// GET: get thread by id
threadsRouter.get("/:id", validateIdParam, threadsController.getThreadById);

// POST: create a new thread
threadsRouter.post("/", threadsController.createThread);

// PUT: update thread by id
threadsRouter.put("/:id", threadsUpdateMiddleware, threadsController.updateThread);

// DELETE: delete thread by id (ADMIN ONLY)
threadsRouter.delete("/:id", authenticateAdmin, threadsController.deleteThread);

// POST: star a thread
threadsRouter.post("/:id/star", threadsController.starThread);

// DELETE: unstar a thread
threadsRouter.delete("/:id/star", threadsController.unstarThread);

///////////////////////// COMMENTS /////////////////////////

// GET: get comment by id
threadsRouter.get("/comment/:id", threadsController.getCommentById);

// POST: create a new comment
threadsRouter.post("/comment", commentsCreateMiddleware, threadsController.createComment);

// PUT: update comment by id
threadsRouter.put("/comment/:id", commentsUpdateMiddleware, threadsController.updateComment);

// DELETE: delete comment by id (ADMIN ONLY)
threadsRouter.delete("/comment/:id", authenticateAdmin, threadsController.deleteComment);

export default threadsRouter;
