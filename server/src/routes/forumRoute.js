import express from "express";
import forumController from "../controllers/forumController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const forumRouter = express.Router();
forumRouter.use(authenticateToken);

// GET: get all forums
forumRouter.get("/", forumController.getForums);

// GET: get forum by id
forumRouter.get("/:id", forumController.getForumById);

// POST: create a new forum
forumRouter.post("/", forumController.createForum);

// PUT: update forum by id
forumRouter.put("/:id", forumController.updateForum);

// DELETE: delete forum by id
forumRouter.delete("/:id", forumController.deleteForum);

// GET: get forums by exam
forumRouter.get("/exam/:id", forumController.getForumsByExam);

// GET: get forums by course
forumRouter.get("/course/:id", forumController.getForumsByCourse);

// GET: get forums by user
forumRouter.get("/user/:id", forumController.getForumsByUser);

// GET: get forums by tags
forumRouter.get("/tags/:tags", forumController.getForumsByTags);

// POST: toggle forum closed status
forumRouter.post("/:id/toggle", forumController.toggleForumClosed);

// GET: get comment by id
forumRouter.get("/comment/:id", forumController.getCommentById);

// POST: add a new comment to a forum
forumRouter.post("/:id/comment", forumController.addCommentToForum);

// POST: add a new reply to a comment
forumRouter.post("/:forumId/comment/:commentId/reply", forumController.addReplyToComment);

// PUT: update comment in a forum
forumRouter.put("/:forumId/comment/:commentId", forumController.updateCommentInForum);

// PUT: update reply in a comment
forumRouter.put("/:forumId/comment/:commentId/reply/:replyId", forumController.updateReplyInComment);

// PUT: toggle like on a comment
forumRouter.put("comment/:id/like", forumController.toggleLikeOnComment);

// DELETE: delete comment from a forum
forumRouter.delete("/:forumId/comment/:commentId", forumController.deleteCommentFromForum);

// DELETE: delete reply from a comment
forumRouter.delete("/:forumId/comment/:commentId/reply/:replyId", forumController.deleteReplyFromComment);
