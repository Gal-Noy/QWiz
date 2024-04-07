import express from "express";
import usersController from "../controllers/usersController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";

const usersRouter = express.Router();
usersRouter.use(authenticateToken);

// GET: get all users
usersRouter.get("/", authenticateAdmin, usersController.getAllUsers);

// GET: get a user by id
usersRouter.get("/:id", usersController.getUserById);

// PUT: update a user by id
usersRouter.put("/:id", usersController.updateUserById);

// DELETE: delete a user by id
usersRouter.delete("/:id", authenticateAdmin, usersController.deleteUserById);

export default usersRouter;
