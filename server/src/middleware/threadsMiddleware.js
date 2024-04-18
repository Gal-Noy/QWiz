import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Comment } from "../models/threadModels.js";
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

export { validateIdParam, deleteThread, deleteThreads, populateThread, deleteComment, deleteComments, populateComment };
