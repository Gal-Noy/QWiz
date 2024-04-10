import mongoose from "mongoose";

// Each exam has a a list of threads
// Threads are the main posts, and they are designed as a tree structure
// The root node is the thread instance and the children are the comments
// first level called comments, deeper level called replies (comments of comments)

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

threadSchema.pre("remove", async function (next) {
  await this.model("User").updateMany({ starred_threads: this._id }, { $pull: { starred_threads: this._id } });

  await Comment.deleteMany({ _id: { $in: this.comments } });
  next();
});

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

threadSchema.pre("findOne", populateThread);
threadSchema.pre("find", populateThread);

export const Thread = mongoose.model("Thread", threadSchema);

const commentSchema = new mongoose.Schema({
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

commentSchema.pre("remove", async function (next) {
  await Comment.deleteMany({ _id: { $in: this.replies } });
  next();
});

const populateComment = function (next) {
  this.populate("sender", "name");
  this.populate({
    path: "replies",
    options: { sort: { createdAt: "asc" } },
  });
  next();
};

commentSchema.pre("findOne", populateComment);
commentSchema.pre("find", populateComment);

export const Comment = mongoose.model("Comment", commentSchema);
