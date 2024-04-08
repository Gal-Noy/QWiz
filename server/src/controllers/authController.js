import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
  register: async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) {
        return res.status(400).json({ message: "Please enter all fields" });
      }

      const { name, email, password, confirmPassword } = req.body;

      const existingUser = await User.findOne({ email: req.body.email.toLowerCase() }).exec();

      if (existingUser) {
        return res.status(400).json({ message: "User with same email already exists." });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      };

      const user = await User.create(newUser);

      return res.status(201).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },

  login: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).exec();

      if (user && (await bcrypt.compare(password, user.password))) {
        if (user.isActive) return res.status(400).json({ message: "User is already logged in." });

        const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h" });

        user.isActive = true;
        user.lastActivity = Date.now();
        await user.save();

        delete user.password;

        return res.status(200).json({
          token,
          user,
          message: "User logged in successfully.",
        });
      }

      return res.status(400).json({ message: "Invalid Credentials." });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const dbUser = await User.findById(userId);

      dbUser.isActive = false;
      dbUser.lastActivity = Date.now();
      await dbUser.save();

      return res.status(200).json({ message: "User logged out successfully." });
    } catch (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
  },
};

export default authController;
