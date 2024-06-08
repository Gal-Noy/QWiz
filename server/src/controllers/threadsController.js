import { Thread, Comment } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Course } from "../models/categoriesModels.js";
import { paginateAndSort, paginateWithCustomSort } from "../utils/paginationUtils.js";
import { getContentText } from "../utils/threadsUtils.js";

/**
 * Controller for the handling of threads and comments.
 */
const threadsController = {
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
        title, // title regex
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

      // Validate fields
      if (title && (title.trim().length < 2 || title.trim().length > 100)) {
        return res
          .status(400)
          .json({ type: "TitleInvalidError", message: "Title must be between 2 and 100 characters" });
      }
      if (getContentText(content) === "") {
        return res.status(400).json({ type: "ContentInvalidError", message: "Content must not be empty" });
      }
      if (tags && tags.length > 0) {
        if (tags.some((tag) => tag.trim().length < 2 || tag.trim().length > 20)) {
          return res.status(400).json({ type: "TagInvalidError", message: "Tags must be between 2 and 20 characters" });
        }
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
        thread: thread._id,
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
      const { title, tags } = req.body;

      // Validate fields
      if (title && (title.trim().length < 2 || title.trim().length > 100)) {
        return res
          .status(400)
          .json({ type: "TitleInvalidError", message: "Title must be between 2 and 100 characters" });
      }
      if (tags && tags.length > 0) {
        if (tags.some((tag) => tag.trim().length < 2 || tag.trim().length > 20)) {
          return res.status(400).json({ type: "TagInvalidError", message: "Tags must be between 2 and 20 characters" });
        }
      }

      if (title && title !== thread.title && thread.comments.length > 0) {
        // Update the main comment title as well
        const mainComment = await Comment.findById(thread.comments[0]);
        mainComment.title = title;
        await mainComment.save();
      }

      if (tags && tags.length > 0) {
        // Update course and exam tags if necessary
        const exam = await Exam.findById(thread.exam);
        const course = await Course.findById(exam.course);

        course.tags = [...new Set([...course.tags, ...tags])];
        await course.save();

        exam.tags = [...new Set([...exam.tags, ...tags])];
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
      const { thread, title, content } = req.body;

      if (!content) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide content" });
      }

      // Validate fields

      if (content && getContentText(content) === "") {
        return res.status(400).json({ type: "ContentInvalidError", message: "Content must not be empty" });
      }
      if (title && (title.trim().length < 2 || title.trim().length > 100)) {
        return res
          .status(400)
          .json({ type: "TitleInvalidError", message: "Title must be between 2 and 100 characters" });
      }

      // Create the new comment

      let comment;

      if (req.thread) {
        const newComment = {
          title: title || `תגובה לדיון: ${req.thread.title}`, // Default title, can be changed by sender later
          content,
          sender: req.user.user_id,
          thread: req.thread._id,
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
          thread,
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
          thread,
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
      const comment = req.comment;
      const { title, content, like } = req.body;

      // Validate fields
      if (title && (title.trim().length < 2 || title.trim().length > 100)) {
        return res
          .status(400)
          .json({ type: "TitleInvalidError", message: "Title must be between 2 and 100 characters" });
      }
      if (content && getContentText(content) === "") {
        return res.status(400).json({ type: "ContentInvalidError", message: "Content must not be empty" });
      }

      if (title && req.thread.comments[0]._id.toString() === comment._id.toString()) {
        req.thread.title = title;
        await req.thread.save();
      }

      if (like && !comment.likes.includes(req.user.user_id)) {
        comment.likes.push(req.user.user_id);
      }
      if (!like && comment.likes.includes(req.user.user_id)) {
        comment.likes = comment.likes.filter((like) => like.toString() !== req.user.user_id);
      }

      if (title) comment.title = title;
      if (content) comment.content = content;
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
};

export default threadsController;
