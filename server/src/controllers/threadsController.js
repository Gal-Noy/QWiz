import { Thread, Comment } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";

const threadPopulate = [
  {
    path: "creator",
    select: "name",
  },
  {
    path: "comments",
    options: { sort: { createdAt: "asc" } },
    populate: {
      path: "sender",
      select: "name",
    },
  },
];

const commentPopulate = [
  {
    path: "sender",
    select: "name",
  },
  {
    path: "replies",
    options: { sort: { createdAt: "asc" } },
    populate: {
      path: "sender",
      select: "name",
    },
  },
];

const threadsController = {
  // Threads

  getAllThreads: async (req, res) => {
    try {
      const threads = await Thread.find().populate(threadPopulate);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getThreadsByExam: async (req, res) => {
    try {
      const threads = await Thread.find({ exam: req.params.id }).populate(threadPopulate);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getThreadById: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createThread: async (req, res) => {
    try {
      const { title, exam, tags } = req.body;

      if (!title || !exam) {
        return res.status(400).json({ message: "Please provide title and exam" });
      }

      const examObj = await Exam.findById(exam);

      if (!examObj) {
        return res.status(404).json({ message: "Exam not found" });
      }

      const newThread = {
        title,
        exam,
        creator: req.user.user_id,
        tags: tags || [],
      };

      const thread = new Thread(newThread);
      await thread.save();
      res.status(201).json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      thread.set(req.body);
      await thread.save();

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      await thread.remove();

      res.json({ message: "Thread deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getThreadsByUserId: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.params.id }).populate(threadPopulate);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getThreadsByUser: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.user.user_id }).populate(threadPopulate);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getThreadsByTags: async (req, res) => {
    try {
      const threads = await Thread.find({ tags: { $in: [req.params.tag] } }).populate(threadPopulate);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleThreadClosed: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      if (thread.creator.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      thread.isClosed = !thread.isClosed;
      await thread.save();

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Comments

  getCommentById: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id).populate(commentPopulate);
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addCommentToThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Please provide content" });
      }

      const newComment = {
        content,
        sender: req.user.user_id,
      };

      const comment = new Comment(newComment);
      await comment.save();

      thread.comments.push(comment._id);
      await thread.save();

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addReplyToComment: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const comment = await Comment.findById(req.params.commentId).populate(commentPopulate);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Please provide content" });
      }

      const newReply = {
        content,
        sender: req.user.user_id,
      };

      const reply = new Comment(newReply);
      await reply.save();

      comment.replies.push(reply._id);
      await comment.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCommentInThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const comment = thread.comments.find((comment) => comment._id.toString() === req.params.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.sender.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      comment.set(req.body);
      await comment.save();

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateReplyInComment: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId).populate(threadPopulate);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const comment = await Comment.findById(req.params.commentId).populate(commentPopulate);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reply = comment.replies.find((reply) => reply._id.toString() === req.params.replyId);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }
      if (reply.sender.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      reply.set(req.body);
      await reply.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleLikeOnComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id).populate(commentPopulate);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const index = comment.likes.indexOf(req.user.user_id);
      if (index === -1) {
        comment.likes.push(req.user.user_id);
      } else {
        comment.likes.splice(index, 1);
      }

      await comment.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.body.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      await comment.remove();

      res.json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default threadsController;
