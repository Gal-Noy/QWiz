import express from "express";
import usersController from "../controllers/usersController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { validateIdParam } from "../middleware/usersMiddleware.js";

const usersRouter = express.Router();
usersRouter.use(authenticateToken);

// GET: get all users (ADMIN ONLY)
usersRouter.get("/", authenticateAdmin, usersController.getAllUsers);

// GET: get a user by id (ADMIN ONLY)
usersRouter.get("/:id", authenticateAdmin, usersController.getUserById);

// PUT: update a user by id (ADMIN ONLY)
usersRouter.put("/:id", authenticateAdmin, validateIdParam, usersController.updateUserById);

// DELETE: delete a user by id (ADMIN ONLY)
usersRouter.delete("/:id", authenticateAdmin, usersController.deleteUserById);

// PUT: edit user's details
usersRouter.put("/edit", usersController.editUserDetails);

export default usersRouter;
