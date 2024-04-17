import { Thread, Comment } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Course } from "../models/categoriesModels.js";

/**
 * Controller for the handling of threads and comments.
 */
const threadsController = {
  ///////////////////////// THREADS CRUD /////////////////////////

  /**
   * Get all threads.
   * Only admins can get all threads.
   *
   * @async
   * @function getAllThreads
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The threads.
   * @throws {Error} - If an error occurred while getting the threads.
   */
  getAllThreads: async (req, res) => {
    try {
      const threads = await Thread.find();

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get a thread by ID.
   *
   * @async
   * @function getThreadById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The thread.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {Error} - If an error occurred while getting the thread.
   */
  getThreadById: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      // Increment thread views count on each request
      thread.views++;
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Create a new thread.
   * The thread is created with a main comment.
   *
   * @async
   * @function createThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The created thread.
   * @throws {MissingFieldsError} - If required fields are missing.
   * @throws {ExamNotFoundError} - If the exam was not found.
   * @throws {Error} - If an error occurred while creating the thread.
   */
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

      // Create the new thread
      const newThread = {
        title,
        exam,
        creator: req.user.user_id,
        tags: tags || [],
      };
      const thread = new Thread(newThread);

      // Create the main comment
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

  /**
   * Update a thread by ID.
   * Only admins can update threads.
   * Thread's creator can only edit the title (editThreadTitle).
   *
   * @async
   * @function updateThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The updated thread.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {Error} - If an error occurred while updating the thread.
   */
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

  /**
   * Delete a thread by ID.
   * Only admins can delete threads.
   *
   * @async
   * @function deleteThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The deletion message.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {Error} - If an error occurred while deleting the thread.
   */
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

  ///////////////////////// THREADS SEARCH /////////////////////////

  /**
   * Get threads by exam ID.
   *
   * @async
   * @function getThreadsByExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The threads.
   * @throws {ExamNotFoundError} - If the exam was not found.
   * @throws {Error} - If an error occurred while getting the threads.
   */
  getThreadsByExam: async (req, res) => {
    try {
      const examObj = await Exam.findById(req.params.id);

      if (!examObj) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      const threads = await Thread.find({ exam: req.params.id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get threads by user ID.
   * Only admins can get threads by user ID.
   *
   * @async
   * @function getThreadsByUserId
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The threads.
   * @throws {Error} - If an error occurred while getting the threads.
   */
  getThreadsByUserId: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.params.id });

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get threads created by the user.
   *
   * @async
   * @function getCreatedThreads
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The threads.
   * @throws {Error} - If an error occurred while getting the threads.
   */
  getCreatedThreads: async (req, res) => {
    try {
      const threads = await Thread.find({ creator: req.user.user_id });

      return res.json(threads);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get starred threads by the user.
   *
   * @async
   * @function getStarredThreads
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The starred threads.
   * @throws {Error} - If an error occurred while getting the threads.
   */
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

  ///////////////////////// THREADS ACTIONS /////////////////////////

  /**
   * Edit the title of a thread.
   * Only the creator of the thread can edit the title.
   *
   * @async
   * @function editThreadTitle
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The updated thread.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {AccessDeniedError} - If the user is not the creator of the thread.
   * @throws {MissingFieldsError} - If required fields are missing.
   * @throws {Error} - If an error occurred while updating the thread.
   */
  editThreadTitle: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.creator._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, creator only" });
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

  /**
   * Toggle the closed status of a thread.
   * Only the creator of the thread can toggle the status.
   *
   * @async
   * @function toggleThreadClosed
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The updated thread.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {AccessDeniedError} - If the user is not the creator of the thread.
   * @throws {Error} - If an error occurred while toggling the thread status.
   */
  toggleThreadClosed: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }

      if (thread.creator._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, creator only" });
      }

      // Toggle the closed status
      thread.isClosed = !thread.isClosed;
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Star a thread.
   *
   * @async
   * @function starThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The starred threads.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {Error} - If an error occurred while starring the thread.
   */ starThread: async (req, res) => {
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

  /**
   * Unstar a thread.
   *
   * @async
   * @function unstarThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The starred threads.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {Error} - If an error occurred while unstarring the thread.
   */
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

  ///////////////////////// COMMENTS CRUD /////////////////////////

  /**
   * Get a comment by ID.
   *
   * @async
   * @function getCommentById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The comment.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {Error} - If an error occurred while getting the comment.
   */
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

  /**
   * Create a new comment from request body.
   * Only admins can create comments directly.
   * Users can add comments to threads (addCommentToThread) or replies to comments (addReplyToComment).
   *
   * @async
   * @function createComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The created comment.
   * @throws {Error} - If an error occurred while creating the comment.
   */
  createComment: async (req, res) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Update a comment by ID.
   * Only admins can update comments directly.
   * Comment's sender can only edit the title and content (editComment).
   *
   * @async
   * @function updateComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The updated comment.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {Error} - If an error occurred while updating the comment.
   */
  updateComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      comment.set(req.body);
      await comment.save();

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Delete a comment by ID.
   * Only admins can delete comments.
   *
   * @async
   * @function deleteComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The deletion message.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {Error} - If an error occurred while deleting the comment.
   */
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

  ///////////////////////// COMMENTS ACTIONS /////////////////////////

  /**
   * Add a new comment to a thread.
   *
   * @async
   * @function addCommentToThread
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread} - The updated thread.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {MissingFieldsError} - If required fields are missing.
   * @throws {AccessDeniedError} - If the thread is closed.
   * @throws {Error} - If an error occurred while adding the comment.
   */
  addCommentToThread: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Thread is closed" });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide content" });
      }

      const newComment = {
        title: `תגובה לדיון: ${thread.title}`, // Default title, can be changed by sender later
        content,
        sender: req.user.user_id,
      };

      const comment = new Comment(newComment);
      await comment.save();

      // Add the comment to the thread
      thread.comments.push(comment._id);
      await thread.save();

      return res.status(201).json(thread);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Add a new reply to a comment.
   *
   * @async
   * @function addReplyToComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The updated comment.
   * @throws {ThreadNotFoundError} - If the thread was not found.
   * @throws {AccessDeniedError} - If the thread is closed.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {MissingFieldsError} - If required fields are missing.
   * @throws {Error} - If an error occurred while adding the reply.
   */
  addReplyToComment: async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.threadId);

      if (!thread) {
        return res.status(404).json({ type: "ThreadNotFoundError", message: "Thread not found" });
      }
      if (thread.isClosed) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Thread is closed" });
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
        title: `תגובה ל: ${comment.sender.name}`, // Default title, can be changed by sender later
        content,
        sender: req.user.user_id,
      };

      const reply = new Comment(newReply);
      await reply.save();

      // Add the reply to the comment
      comment.replies.push(reply._id);
      await comment.save();

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Edit a comment by ID.
   * Only the sender of the comment can edit it.
   *
   * @async
   * @function editComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The updated comment.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {AccessDeniedError} - If the user is not the sender of the comment.
   * @throws {Error} - If an error occurred while updating the comment.
   */
  editComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }
      if (comment.sender._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, sender only" });
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

  /**
   * Toggle like on a comment.
   *
   * @async
   * @function toggleLikeComment
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Comment} - The updated comment.
   * @throws {CommentNotFoundError} - If the comment was not found.
   * @throws {Error} - If an error occurred while toggling the like.
   */
  toggleLikeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ type: "CommentNotFoundError", message: "Comment not found" });
      }

      // Search for the user in the likes array, and add/remove accordingly
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
};

export default threadsController;
