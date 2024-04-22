import mongoose from "mongoose";
import {
  deleteThread,
  deleteThreads,
  populateThread,
  deleteComment,
  deleteComments,
  populateComment,
} from "../middleware/threadsMiddleware.js";

/**
 * Each exam has a a list of threads.
 * Threads are the main posts, and they are designed as a tree structure.
 * The root node is the thread instance and the children are the comments.
 * first level called comments, deeper level called replies (comments of comments).
 */

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
    },
  ],
  isClosed: {
    // can be closed only by the creator
    type: Boolean,
    default: false,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

threadSchema.pre("findOneAndDelete", deleteThread);
threadSchema.pre("deleteOne", deleteThread);
threadSchema.pre("deleteMany", deleteThreads);

threadSchema.pre("findOne", populateThread);
threadSchema.pre("find", populateThread);

threadSchema.pre("save", async function (next) {
  const thread = this;

  thread.tags = thread.tags.sort();

  next();
});

export const Thread = mongoose.model("Thread", threadSchema);

const commentSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

commentSchema.pre("findOneAndDelete", deleteComment);
commentSchema.pre("deleteOne", deleteComment);
commentSchema.pre("deleteMany", deleteComments);

commentSchema.pre("findOne", populateComment);
commentSchema.pre("find", populateComment);

export const Comment = mongoose.model("Comment", commentSchema);
