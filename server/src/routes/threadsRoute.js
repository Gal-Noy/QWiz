import express from "express";
import threadsController from "../controllers/threadsController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const threadsRouter = express.Router();
threadsRouter.use(authenticateToken);

// GET: get all threads
threadsRouter.get("/", authenticateAdmin, threadsController.getAllThreads);

// GET: get threads by exam
threadsRouter.get("/exam/:id", threadsController.getThreadsByExam);

// GET: get thread by id
threadsRouter.get("/:id", threadsController.getThreadById);

// POST: create a new thread
threadsRouter.post("/", threadsController.createThread);

// PUT: update thread by id
threadsRouter.put("/:id", authenticateAdmin, threadsController.updateThread);

// PUT: edit title or content of a thread
threadsRouter.put("/:id/edit", threadsController.editThread);

// DELETE: delete thread by id
threadsRouter.delete("/:id", authenticateAdmin, threadsController.deleteThread);

// GET: get threads by user id
threadsRouter.get("/user/:id", authenticateAdmin, threadsController.getThreadsByUserId);

// GET: get threads by user (my threads)
threadsRouter.get("/user", threadsController.getThreadsByUser);

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

// PUT: update comment in a thread
threadsRouter.put("/:threadId/comment/:commentId", threadsController.updateCommentInThread);

// PUT: update reply in a comment
threadsRouter.put("/:threadId/comment/:commentId/reply/:replyId", threadsController.updateReplyInComment);

// PUT: toggle like on a comment
threadsRouter.put("/comment/:id/like", threadsController.toggleLikeOnComment);

// DELETE: delete a comment
threadsRouter.delete("/comment/:id", authenticateAdmin, threadsController.deleteComment);

export default threadsRouter;
