import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Thread, Comment } from "../models/threadModels.js";
import threadsController from "../controllers/threadsController.js";

const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    switch (id) {
      case "created": {
        return threadsController.getCreatedThreads(req, res);
      }
      case "starred": {
        return threadsController.getStarredThreads(req, res);
      }
      default: {
        return res.status(400).json({ type: "InvalidIDError", message: "Invalid ID." });
      }
    }
  }
  next();
};

const deleteThread = async function (next) {
  const threadToDelete = await this.model.findOne(this.getQuery());
  const { _id: threadId } = threadToDelete;

  try {
    await Comment.deleteMany({ _id: { $in: threadToDelete.comments } });

    await User.updateMany({ starred_threads: threadId }, { $pull: { starred_threads: threadId } });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteThreads = async function (next) {
  const threadsToDelete = await this.model.find(this.getQuery());
  const threadIds = threadsToDelete.map((thread) => thread._id);

  try {
    await Comment.deleteMany({ _id: { $in: threadsToDelete.flatMap((thread) => thread.comments) } });

    await User.updateMany({ starred_threads: { $in: threadIds } }, { $pull: { starred_threads: { $in: threadIds } } });

    next();
  } catch (error) {
    next(error);
  }
};

const populateThread = function (next) {
  this.populate("creator", "name");
  this.populate({
    path: "exam",
    populate: {
      path: "course",
      select: "name",
    },
  });
  this.populate({
    path: "comments",
    options: { sort: { createdAt: "asc" } },
  });
  next();
};

const deleteComment = async function (next) {
  const commentToDelete = await this.model.findOne(this.getQuery());

  try {
    if (commentToDelete.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: commentToDelete.replies } });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const deleteComments = async function (next) {
  const commentsToDelete = await this.model.find(this.getQuery());
  const allReplies = commentsToDelete.flatMap((comment) => comment.replies);

  try {
    if (allReplies.length > 0) {
      await Comment.deleteMany({ _id: { $in: allReplies } });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const populateComment = function (next) {
  this.populate("sender", "name");
  this.populate({
    path: "replies",
    options: { sort: { createdAt: "asc" } },
  });
  next();
};

const threadsUpdateMiddleware = async (req, res, next) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
    }

    if (req.user.role !== "admin") {
      if (thread.creator._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, creator only" });
      }
      if (req.body.isClosed !== false && thread.isClosed) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Thread is closed" });
      }

      // Only allow certain fields to be updated
      const allowedFields = ["title", "tags", "isClosed"];
      for (const field in req.body) {
        if (!allowedFields.includes(field)) {
          return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, restricted field" });
        }
      }
    }

    req.thread = thread;

    next();
  } catch (error) {
    return res.status(500).json({ type: "ServerError", message: error.message });
  }
};

const commentsCreateMiddleware = async (req, res, next) => {
  try {
    const { threadId, commentId } = req.body;

    if (req.user.role !== "admin") {
      if (!threadId) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Missing field: threadId" });
      }

      const thread = await Thread.findById(threadId);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Thread is closed" });
      }

      if (commentId) { // If replying to a comment
        const comment = await Comment.findById(commentId);

        if (!comment) {
          return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
        }

        req.comment = comment;
      }
      else { // If creating a new comment in a thread
        req.thread = thread;
      }

      const allowedFields = ["threadId", "commentId", "content"];
      for (const field in req.body) {
        if (!allowedFields.includes(field)) {
          return res.status(403).json({ type: "AccessDeniedError", message: `Access denied, restricted field: ${field}` });
        }
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ type: "ServerError", message: error.message });
  }
};

const commentsUpdateMiddleware = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
    }

    if (req.user.role !== "admin") {
      if (comment.sender._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, sender only" });
      }

      // Only allow certain fields to be updated
      const allowedFields = ["content"];
      for (const field in req.body) {
        if (!allowedFields.includes(field)) {
          return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, restricted field" });
        }
      }
    }

    req.comment = comment;

    next();
  } catch (error) {
    return res.status(500).json({ type: "ServerError", message: error.message });
  }
};

export {
  validateIdParam,
  deleteThread,
  deleteThreads,
  populateThread,
  deleteComment,
  deleteComments,
  populateComment,
  threadsUpdateMiddleware,
  commentsCreateMiddleware,
};
