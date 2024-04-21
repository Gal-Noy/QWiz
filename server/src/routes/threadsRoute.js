import express from "express";
import threadsController from "../controllers/threadsController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { validateIdParam } from "../middleware/threadsMiddleware.js";
import { PSMiddleware } from "../middleware/PSMiddleware.js";

const threadsRouter = express.Router();
threadsRouter.use(authenticateToken);

///////////////////////// THREADS CRUD /////////////////////////

// GET: get threads
threadsRouter.get("/", PSMiddleware, threadsController.getThreads);

// GET: get thread by id
threadsRouter.get("/:id", validateIdParam, threadsController.getThreadById);

// POST: create a new thread
threadsRouter.post("/", threadsController.createThread);

// PUT: update thread by id (ADMIN ONLY)
threadsRouter.put("/:id", authenticateAdmin, threadsController.updateThread);

// DELETE: delete thread by id (ADMIN ONLY)
threadsRouter.delete("/:id", authenticateAdmin, threadsController.deleteThread);

///////////////////////// THREADS ACTIONS /////////////////////////

// PUT: edit title of a thread
threadsRouter.put("/:id/edit", threadsController.editThreadTitle);

// POST: toggle thread closed status
threadsRouter.post("/:id/toggle", threadsController.toggleThreadClosed);

// POST: star a thread
threadsRouter.post("/:id/star", threadsController.starThread);

// DELETE: unstar a thread
threadsRouter.delete("/:id/star", threadsController.unstarThread);

///////////////////////// COMMENTS CRUD /////////////////////////

// GET: get comment by id
threadsRouter.get("/comment/:id", threadsController.getCommentById);

// POST: create a new comment (ADMIN ONLY)
threadsRouter.post("/:id/comment", authenticateAdmin, threadsController.createComment);

// PUT: update comment by id (ADMIN ONLY)
threadsRouter.put("/comment/:id", authenticateAdmin, threadsController.updateComment);

// DELETE: delete comment by id (ADMIN ONLY)
threadsRouter.delete("/comment/:id", authenticateAdmin, threadsController.deleteComment);

///////////////////////// COMMENTS ACTIONS /////////////////////////

// POST: add a new comment to a thread
threadsRouter.post("/:id/comment", threadsController.addCommentToThread);

// POST: add a new reply to a comment
threadsRouter.post("/:threadId/comment/:commentId/reply", threadsController.addReplyToComment);

// PUT: edit a comment
threadsRouter.put("/:threadId/comment/:commentId/edit", threadsController.editComment);

// PUT: toggle like on a comment
threadsRouter.put("/comment/:id/like", threadsController.toggleLikeComment);

export default threadsRouter;
