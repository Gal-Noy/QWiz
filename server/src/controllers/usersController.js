import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const newDetails = req.body;

      if (newDetails.password) {
        if (newDetails.password.length < 6) {
          res
            .status(400)
            .json({ type: "PasswordLengthError", message: "Password must be at least 6 characters long." });
        }
        const hashedPassword = await bcrypt.hash(newDetails.password, 10);
        newDetails.password = hashedPassword;
      }
      
      delete newDetails.password;

      const dbUser = await User.findById(req.params.id);
      dbUser.set(newDetails);
      await dbUser.save();

      return res.json(dbUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      return res.json(deletedUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default usersController;
