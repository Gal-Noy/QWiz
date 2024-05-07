import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Thread } from "../models/threadModels.js";
import usersController from "../controllers/usersController.js";

/**
 * Middleware to validate the ID parameter
 *
 * @function validateIdParam
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback function
 * @returns {void}
 * @throws {InvalidIDError} - Invalid ID
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    switch (id) {
      case "edit": {
        return usersController.editUserDetails(req, res);
      }
      default: {
        return res.status(400).json({ type: "InvalidIDError", message: "Invalid ID." });
      }
    }
  }
  next();
};

/**
 * Middleware to delete a user
 *
 * @async
 * @function deleteUser
 * @param {Function} next - Callback function
 * @returns {void}
 * @throws {Error} - Database error
 */
const deleteUser = async function (next) {
  const userId = this._conditions._id;

  if (this._conditions.role === "admin") {
    console.warn("Admins can't be deleted");
    return next();
  }

  try {
    await Thread.deleteMany({ creator: userId });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete multiple users
 *
 * @async
 * @function deleteUsers
 * @param {Function} next - Callback function
 * @returns {void}
 * @throws {Error} - Database error
 */
const deleteUsers = async function (next) {
  const userIds = this._conditions._id;

  try {
    await Thread.deleteMany({ creator: { $in: userIds } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to update user details based on role
 *
 * @async
 * @function usersUpdateMiddleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback function
 * @returns {void}
 */
const usersUpdateMiddleware = async (req, res, next) => {
  if (req.user.user_id.toString() !== req.params.id) {
    return res.status(403).json({ type: "AccessDeniedError", message: "Access denied." });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ type: "UserNotFoundError", message: "User not found." });
  }

  if (user.role !== "admin") {
    const allowedFields = [
      "name",
      "email",
      "password",
      "phone_number",
      "id_number",
      "favorite_exams",
      "starred_threads",
    ];

    for (const field in req.body) {
      if (!allowedFields.includes(field)) {
        return res
          .status(403)
          .json({ type: "AccessDeniedError", message: `Access denied, restricted field: ${field}` });
      }
    }
  }

  req.user = user;

  next();
};

export { validateIdParam, deleteUser, deleteUsers, usersUpdateMiddleware };
