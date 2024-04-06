import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});

      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },

  updateUserById: async (req, res) => {
    try {
      const newDetails = req.body;

      if (newDetails.password) {
        if (newDetails.password.length < 6) {
          return res.status(400).send("Password must be at least 6 characters long");
        }
        const hashedPassword = await bcrypt.hash(newDetails.password, 10);
        newDetails.password = hashedPassword;
      } else {
        delete newDetails.password;
      }

      const dbUser = await User.findById(req.params.id);
      dbUser.set(newDetails);
      await dbUser.save();

      return res.status(200).json(dbUser);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      return res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  },
};

export default usersController;
