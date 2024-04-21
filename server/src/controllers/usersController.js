import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

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
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});

      return res.json(users);
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
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      user.set(req.body);
      await user.save();

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

  /**
   * Edit user's details
   * User can edit their email, password, name, phone number, and ID number
   *
   * @async
   * @function editUserDetails
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {User} - Updated user object
   * @throws {MissingFieldsError} - At least one field must be filled
   * @throws {EmailError} - Invalid email
   * @throws {NameLengthError} - Name must be at least 2 characters long
   * @throws {PhoneNumberError} - Invalid phone number
   * @throws {PhoneNumberLengthError} - Phone number must be at least 9 digits long
   * @throws {IDNumberError} - Invalid ID number
   * @throws {PasswordLengthError} - Password must be at least 6 characters long
   * @throws {Error} - Server error
   */
  editUserDetails: async (req, res) => {
    try {
      const newDetails = req.body;

      const { email, password, name, phone_number, id_number } = newDetails;

      if (!email && !password && !name && !phone_number && !id_number) {
        return res.status(400).json({ type: "MissingFieldsError", message: "At least one field must be filled" });
      }

      // Validate email, name, phone_number, id_number, password
      if (
        email &&
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        return res.status(400).json({ type: "EmailError", message: "Invalid email" });
      }

      if (name && name.length < 2) {
        return res.status(400).json({ type: "NameLengthError", message: "Name must be at least 2 characters long." });
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
        password = hashedPassword;
      }

      delete newDetails.password;

      const dbUser = await User.findById(req.params.id);
      dbUser.set(newDetails);

      await dbUser.save();

      return res.json(dbUser);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },
};

export default usersController;
