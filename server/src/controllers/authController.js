import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Controller for handling user registration, login and logout.
 */
const authController = {
  /**
   * Registers a new user.
   *
   * @async
   * @function register
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {User} The created user.
   * @throws {MissingFieldsError} If not all fields are provided.
   * @throws {UserExistError} If a user with the same email already exists.
   * @throws {EmailError} If the email is invalid.
   * @throws {PasswordLengthError} If the password is less than 6 characters long.
   * @throws {PasswordsMismatchError} If the passwords do not match.
   * @throws {Error} If an error occurs while creating the user.
   */
  register: async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please enter all fields" });
      }

      const { name, email, password, confirmPassword } = req.body;

      // Check if user with same email already exists
      const existingUser = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
      if (existingUser) {
        return res.status(400).json({ type: "UserExistError", message: "User with same email already exists." });
      }

      // Validate email and password
      if (
        !email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        return res.status(400).json({ type: "EmailError", message: "Invalid email" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ type: "PasswordLengthError", message: "Password must be at least 6 characters long." });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ type: "PasswordsMismatchError", message: "Passwords do not match." });
      }

      // Encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      };
      const user = await User.create(newUser);

      user.password = undefined;

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Logs in a user.
   *
   * @async
   * @function login
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The user and token.
   * @throws {MissingFieldsError} If not all fields are provided.
   * @throws {UserActiveError} If the user is already logged in.
   * @throws {InvalidCredentialsError} If the credentials are invalid.
   * @throws {Error} If an error occurs while logging in the user.
   */
  login: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please enter all fields" });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() }).exec();

      // Check if user exists and password is correct
      if (user && (await bcrypt.compare(password, user.password))) {
        // Check if user is already logged in
        if (user.isActive) {
          const inactivityTimeoutThreshold = 30 * 60 * 1000; // 30 minutes
          const userInactivityTime = Date.now() - user.lastActivity;

          if (userInactivityTime <= inactivityTimeoutThreshold) {
            // if user is already logged in and was active in the last 30 minutes
            return res.status(400).json({ type: "UserActiveError", message: "User is already logged in." });

            // if user is already logged in but was inactive for more than 30 minutes, they are considered logged out and can log in again
          }
        }

        // Create token
        const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h" });

        // Update user activity
        user.isActive = true;
        user.lastActivity = Date.now();
        await user.save();

        user.password = undefined;

        return res.json({
          token,
          user,
        });
      }

      // Invalid credentials, return error
      return res.status(400).json({ type: "InvalidCredentialsError", message: "Invalid Credentials." });
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Logs out a user.
   *
   * @async
   * @function logout
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The result of logging out the user (message).
   * @throws {Error} If an error occurs while logging out the user.
   */
  logout: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const dbUser = await User.findById(userId);

      // Update user activity
      dbUser.isActive = false;
      dbUser.lastActivity = Date.now();
      await dbUser.save();

      return res.json({ message: "User logged out successfully." });
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },
};

export default authController;
