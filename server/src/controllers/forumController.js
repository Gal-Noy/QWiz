import { Forum, Comment } from "../models/forumModels";

const forumPopulate = {
  path: "comments",
  options: { sort: { createdAt: "asc" } },
  populate: {
    path: "replies",
    options: { sort: { createdAt: "asc" } },
  },
};

const commentPopulate = {
  path: "replies",
  options: { sort: { createdAt: "asc" } },
};

const deleteCommentRecursively = async (commentId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return;
  }

  if (comment.replies.length > 0) {
    for (const replyId of comment.replies) {
      await deleteCommentRecursively(replyId);
    }
  }

  await comment.remove();
};

const forumController = {
  // Forums

  getForums: async (req, res) => {
    try {
      const forums = await Forum.find().populate(forumPopulate);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForumById: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createForum: async (req, res) => {
    try {
      const forum = new Forum(req.body);
      await forum.save();
      res.status(201).json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateForum: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      forum.set(req.body);
      await forum.save();

      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteForum: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      if (forum.creator.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (forum.comments.length > 0) {
        for (const commentId of forum.comments) {
          await deleteCommentRecursively(commentId);
        }
      }

      await forum.remove();

      res.json({ message: "Forum deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForumsByExam: async (req, res) => {
    try {
      const forums = await Forum.find({ exam: req.params.exam }).populate(forumPopulate);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForumsByCourse: async (req, res) => {
    try {
      const forums = await Forum.find({ course: req.params.course }).populate(forumPopulate);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForumsByUser: async (req, res) => {
    try {
      const forums = await Forum.find({ creator: req.params.user }).populate(forumPopulate);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForumsByTags: async (req, res) => {
    try {
      const forums = await Forum.find({ tags: { $in: [req.params.tag] } }).populate(forumPopulate);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleForumClosed: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      if (forum.creator.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      forum.isClosed = !forum.isClosed;
      await forum.save();

      res.json(forum);
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

  addCommentToForum: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
      }

      const comment = new Comment(req.body);
      await comment.save();

      forum.comments.push(comment._id);
      await forum.save();

      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addReplyToComment: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.forumId).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
      }

      const comment = await Comment.findById(req.params.commentId).populate(commentPopulate);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reply = new Comment(req.body);
      await reply.save();

      comment.replies.push(reply._id);
      await comment.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCommentInForum: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.forumId).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
      }

      const comment = forum.comments.find((comment) => comment._id.toString() === req.params.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.sender.toString() !== req.user.user_id) {
        return res.status(403).json({ message: "Access denied" });
      }

      comment.set(req.body);
      await comment.save();

      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateReplyInComment: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.forumId).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
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

  deleteCommentFromForum: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.forumId).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
      }

      const comment = forum.comments.find((comment) => comment._id.toString() === req.params.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.sender.toString() !== req.user.user_id && forum.creator.toString() !== req.user.user_id) {
        // only creator of the comment or the forum can delete the comment
        return res.status(403).json({ message: "Access denied" });
      }

      await deleteCommentRecursively(req.params.commentId);

      forum.comments = forum.comments.filter((comment) => comment._id.toString() !== req.params.commentId);
      await forum.save();

      res.json(forum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteReplyFromComment: async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.forumId).populate(forumPopulate);

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
      if (forum.isClosed) {
        return res.status(403).json({ message: "Forum is closed" });
      }

      const comment = await Comment.findById(req.params.commentId).populate(commentPopulate);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reply = comment.replies.find((reply) => reply._id.toString() === req.params.replyId);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }
      if (reply.sender.toString() !== req.user.user_id && forum.creator.toString() !== req.user.user_id) {
        // only creator of the reply or the forum can delete the reply
        return res.status(403).json({ message: "Access denied" });
      }

      await deleteCommentRecursively(req.params.replyId);

      comment.replies = comment.replies.filter((reply) => reply._id.toString() !== req.params.replyId);
      await comment.save();

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default forumController;
