import { Thread, Comment } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Course } from "../models/infoModels.js";

const threadsController = {
  // Threads

  getAllThreads: async (req, res) => {
    try {
      const threads = await Thread.find();

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getThreadsByExam: async (req, res) => {
    try {
      const threads = await Thread.find({ exam: req.params.id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getThreadById: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      thread.views++;
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createThread: async (req, res) => {
    try {
      const { title, content, exam, tags } = req.body;

      if (!title || !content || !exam) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide title, content and exam" });
      }

      const examObj = await Exam.findById(exam);

      if (!examObj) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      // Update course and exam tags if necessary
      if (tags && tags.length > 0) {
        const course = await Course.findById(examObj.course);
        course.tags = [...new Set([...course.tags, ...tags])];
        await course.save();

        examObj.tags = [...new Set([...examObj.tags, ...tags])];
        await examObj.save();
      }

      const newThread = {
        title,
        exam,
        creator: req.user.user_id,
        tags: tags || [],
      };

      const thread = new Thread(newThread);

      const mainComment = {
        title: title,
        content,
        sender: req.user.user_id,
      };

      const comment = new Comment(mainComment);
      await comment.save();

      thread.comments.push(comment._id);
      await thread.save();

      return res.status(201).json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      thread.set(req.body);
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // New function to edit thread title
  editThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.creator._id.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide title" });
      }

      thread.title = title;
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteThread: async (req, res) => {
    try {
      const thread = await Thread.findByIdAndDelete(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      return res.json({ message: "Thread deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getThreadsByUserId: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.params.id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getThreadsByUser: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.user.user_id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  toggleThreadClosed: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      if (thread.creator._id.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      thread.isClosed = !thread.isClosed;
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCreatedThreads: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.user.user_id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getStarredThreads: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id).populate({
        path: "starred_threads",
      });

      return res.json(user.starred_threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  starThread: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      user.starred_threads.push(thread._id);
      await user.save();

      return res.json(user.starred_threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  unstarThread: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const threadId = req.params.id;

      user.starred_threads = user.starred_threads.filter((thread) => thread._id.toString() !== threadId);
      await user.save();

      return res.json(user.starred_threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Comments

  getCommentById: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  addCommentToThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide content" });
      }

      const newComment = {
        title: `תגובה לדיון: ${thread.title}`,
        content,
        sender: req.user.user_id,
      };

      const comment = new Comment(newComment);
      await comment.save();

      thread.comments.push(comment._id);
      await thread.save();

      return res.status(201).json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  addReplyToComment: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ message: "Thread is closed" });
      }

      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide content" });
      }

      const newReply = {
        title: `תגובה ל: ${comment.sender.name}`,
        content,
        sender: req.user.user_id,
      };

      const reply = new Comment(newReply);
      await reply.save();

      comment.replies.push(reply._id);
      await comment.save();

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }
      if (comment.sender._id.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { title, content } = req.body;
      if (title) comment.title = title;
      if (content) comment.content = content;

      await comment.save();

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  toggleLikeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      const index = comment.likes.indexOf(req.user.user_id);
      if (index === -1) {
        comment.likes.push(req.user.user_id);
      } else {
        comment.likes.splice(index, 1);
      }

      await comment.save();

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.body.commentId);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      return res.json({ message: "Comment deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default threadsController;
