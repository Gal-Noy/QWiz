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

      const { email, password, name, phone_number, id_number } = newDetails;

      if (!email && !password && !name && !phone_number && !id_number) {
        return res.status(400).json({ type: "MissingFieldsError", message: "At least one field must be filled" });
      }

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
