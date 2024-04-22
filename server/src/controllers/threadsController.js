import { Thread, Comment } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Course } from "../models/categoriesModels.js";
import { paginateAndSort, paginateWithCustomSort } from "../utils/PSUtils.js";

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
   * @function getThreads
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Thread[]} - The threads.
   * @throws {Error} - If an error occurred while getting the threads.
   */
  getThreads: async (req, res) => {
    try {
      const {
        title, // Search by title regex
        exam, // Exam ID
        creator, // User ID
        createdAt, // Date range
        views, // Number range
        tags, // Array of tags
        isClosed, // Boolean
        comments, // Number range
        starredOnly, // Boolean
        sortBy, // Sort by field
        sortOrder, // Sort direction
      } = req.query;

      // Filter
      const query = {};
      if (title) query["title"] = { $regex: title, $options: "i" };
      if (exam) query["exam"] = exam;
      if (creator) query["creator"] = creator;
      if (createdAt) query["createdAt"] = { $gte: new Date(createdAt[0]), $lte: new Date(createdAt[1]) };
      if (views) query["views"] = { $gte: views };
      if (tags) query["tags"] = { $elemMatch: { $in: tags.split(",") } };
      if (isClosed) query["isClosed"] = { $eq: isClosed === "true" };
      if (comments) query["comments"] = { $gte: comments };
      if (starredOnly) {
        const user = await User.findById(req.user.user_id);
        query["_id"] = { $in: user.starred_threads };
      }

      let result;

      // Sort
      if (sortBy === "starred") {
        const user = await User.findById(req.user.user_id);
        result = await paginateWithCustomSort(
          Thread,
          query,
          req,
          (a, b) =>
            (sortOrder === "desc" ? -1 : 1) *
            (user.starred_threads.includes(b._id) - user.starred_threads.includes(a._id))
        );
      } else if (sortBy === "lastComment") {
        result = await paginateWithCustomSort(
          Thread,
          query,
          req,
          (a, b) =>
            (sortOrder === "desc" ? -1 : 1) *
            (a.comments.length > 0 && b.comments.length > 0
              ? b.comments[b.comments.length - 1].createdAt - a.comments[a.comments.length - 1].createdAt
              : 0)
        );
      } else {
        result = await paginateAndSort(Thread, query, req);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Update a thread by ID.
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
      const thread = req.thread;

      if (req.body.title && thread.comments.length > 0) {
        // Update the main comment title as well
        const mainComment = await Comment.findById(thread.comments[0]);
        mainComment.title = req.body.title;
        await mainComment.save();
      }

      if (req.body.tags && req.body.tags.length > 0) {
        // Update course and exam tags if necessary
        const exam = await Exam.findById(thread.exam);
        const course = await Course.findById(exam.course);

        course.tags = [...new Set([...course.tags, ...req.body.tags])];
        await course.save();

        exam.tags = [...new Set([...exam.tags, ...req.body.tags])];
        await exam.save();
      }

      thread.set(req.body);
      await thread.save();

      return res.json(thread);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  ///////////////////////// THREADS ACTIONS /////////////////////////

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
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Create a new comment (add a new comment to a thread or reply to a comment).
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
      const { title, content } = req.body;

      if (!content) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide content" });
      }

      let comment;

      if (req.thread) {
        const newComment = {
          title: title || `תגובה לדיון: ${req.thread.title}`, // Default title, can be changed by sender later
          content,
          sender: req.user.user_id,
        };

        comment = new Comment(newComment);
        await comment.save();

        // Add the comment to the thread
        req.thread.comments.push(comment._id);
        await req.thread.save();
      } else if (req.comment) {
        const newComment = {
          title: title || `תגובה ל: ${req.comment.sender.name}`, // Default title, can be changed by sender later
          content,
          sender: req.user.user_id,
        };

        comment = new Comment(newComment);
        await comment.save();

        // Add the comment to the comment
        req.comment.replies.push(comment._id);
        await req.comment.save();
      } else {
        // Create a new comment without a thread or comment, only available for admins
        const newComment = {
          title,
          content,
          sender: req.user.user_id,
        };

        comment = new Comment(newComment);
        await comment.save();
      }

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Update a comment by ID.
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
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  ///////////////////////// COMMENTS ACTIONS /////////////////////////
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
      if (comment.sender._id.toString() !== req.user.user_id) {
        return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, sender only" });
      }

      const { title, content } = req.body;
      if (title) {
        comment.title = title;

        // Update the thread title if necessary
        if (thread.comments[0]._id.toString() === comment._id.toString()) {
          thread.title = title;
          await thread.save();
        }
      }
      if (content) comment.content = content;

      await comment.save();

      return res.json(comment);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
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
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },
};

export default threadsController;
