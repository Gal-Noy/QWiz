import express from "express";
import threadsController from "../controllers/threadsController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const threadsRouter = express.Router();
threadsRouter.use(authenticateToken);

// GET: get all threads
threadsRouter.get("/", authenticateAdmin, threadsController.getAllThreads);

// GET: get threads by exam
threadsRouter.get("/exam/:id", threadsController.getThreadsByExam);

// GET: get threads by user (my threads)
threadsRouter.get("/user", threadsController.getThreadsByUser);

// GET: get starred threads
threadsRouter.get("/starred", threadsController.getStarredThreads);

// GET: get thread by id
threadsRouter.get("/:id", threadsController.getThreadById);

// POST: create a new thread
threadsRouter.post("/", threadsController.createThread);

// POST: star a thread
threadsRouter.post("/:id/star", threadsController.starThread);

// DELETE: unstar a thread
threadsRouter.delete("/:id/star", threadsController.unstarThread);

// PUT: update thread by id
threadsRouter.put("/:id", authenticateAdmin, threadsController.updateThread);

// PUT: edit title of a thread
threadsRouter.put("/:id/edit", threadsController.editThread);

// DELETE: delete thread by id
threadsRouter.delete("/:id", authenticateAdmin, threadsController.deleteThread);

// GET: get threads by user id
threadsRouter.get("/user/:id", authenticateAdmin, threadsController.getThreadsByUserId);

// GET: get threads by tags
threadsRouter.get("/tags/:tags", threadsController.getThreadsByTags);

// POST: toggle thread closed status
threadsRouter.post("/:id/toggle", threadsController.toggleThreadClosed);

// GET: get comment by id
threadsRouter.get("/comment/:id", authenticateAdmin, threadsController.getCommentById);

// POST: add a new comment to a thread
threadsRouter.post("/:id/comment", threadsController.addCommentToThread);

// POST: add a new reply to a comment
threadsRouter.post("/:threadId/comment/:commentId/reply", threadsController.addReplyToComment);

// PUT: update comment
threadsRouter.put("/comment/:id", threadsController.updateComment);

// PUT: toggle like on a comment
threadsRouter.put("/comment/:id/like", threadsController.toggleLikeComment);

// DELETE: delete a comment
threadsRouter.delete("/comment/:id", authenticateAdmin, threadsController.deleteComment);

export default threadsRouter;
