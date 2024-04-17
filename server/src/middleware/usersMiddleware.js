import mongoose from "mongoose";
import { Thread } from "../models/threadModels.js";
import usersController from "../controllers/usersController.js";

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

const deleteUsers = async function (next) {
  const userIds = this._conditions._id;

  try {
    await Thread.deleteMany({ creator: { $in: userIds } });

    next();
  } catch (error) {
    next(error);
  }
};

export { validateIdParam, deleteUser, deleteUsers };
