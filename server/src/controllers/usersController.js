import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { paginateAndSort } from "../utils/PSUtils.js";

/**
 * Controller for handling user-related operations
 */
const usersController = {
  /**
   * Get all users
   * Only admins can access this route
   *
   * @async
   * @function getAllUsers
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {User[]} - Array of all users
   */
  getUsers: async (req, res) => {
    try {
      const {
        name, // name regex
        email, // email regex
        phone_number, // phone number regex
        id_number, // ID number regex
        isActive, // Boolean
        lastActivity, // Date
        role, // user or admin
      } = req.query;

      // Filter
      const query = {};
      if (name) query["name"] = { $regex: name, $options: "i" };
      if (email) query["email"] = { $regex: email, $options: "i" };
      if (phone_number) query["phone_number"] = { $regex: phone_number, $options: "i" };
      if (id_number) query["id_number"] = { $regex: id_number, $options: "i" };
      if (isActive) query["isActive"] = isActive;
      if (lastActivity) query["lastActivity"] = { $gte: lastActivity };
      if (role) query["role"] = role;

      const result = await paginateAndSort(User, req, query);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Get a user by ID
   *
   * @async
   * @function getUserById
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {User} - User object
   * @throws {UserNotFoundError} - User not found
   * @throws {Error} - Server error
   */
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Update a user by ID
   * Only admins can access this route
   *
   * @async
   * @function updateUserById
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {User} - Updated user object
   * @throws {UserNotFoundError} - User not found
   * @throws {Error} - Server error
   */
  updateUserById: async (req, res) => {
    try {
      const user = req.user;
      const { name, email, password, phone_number, id_number, favorite_exams, starred_threads } = req.body;

      if (name && name.length < 2) {
        return res.status(400).json({ type: "NameLengthError", message: "Name must be at least 2 characters long." });
      }
      if (
        email &&
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        return res.status(400).json({ type: "EmailError", message: "Invalid email" });
      }
      if (phone_number) {
        if (!phone_number.match(/^\+?\d{9,20}$/)) {
          return res.status(400).json({ type: "PhoneNumberError", message: "Invalid phone number" });
        }
        if (phone_number.length < 9) {
          return res
            .status(400)
            .json({ type: "PhoneNumberLengthError", message: "Phone number must be at least 9 digits long." });
        }
      }
      if (id_number && !id_number.match(/^\d{9}$/)) {
        return res.status(400).json({ type: "IDNumberError", message: "Invalid ID number" });
      }
      if (password) {
        if (password.length < 6) {
          res
            .status(400)
            .json({ type: "PasswordLengthError", message: "Password must be at least 6 characters long." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // user.password = hashedPassword;
        req.body.password = hashedPassword;
      }

      user.set(req.body);
      await user.save();

      user.password = undefined;

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Delete a user by ID
   * Only admins can access this route
   *
   * @async
   * @function deleteUserById
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {User} - Deleted user object
   * @throws {UserNotFoundError} - User not found
   * @throws {Error} - Server error
   */
  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      return res.json(deletedUser);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

};

export default usersController;
