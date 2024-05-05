import express from "express";
import usersController from "../controllers/usersController.js";
import { authenticateToken, authenticateAdmin } from "../middleware/authMiddleware.js";
import { validateIdParam, usersUpdateMiddleware } from "../middleware/usersMiddleware.js";
import { PSMiddleware } from "../middleware/PSMiddleware.js";

const usersRouter = express.Router();
usersRouter.use(authenticateToken);

// GET: get users (ADMIN ONLY)
usersRouter.get("/", authenticateAdmin, PSMiddleware, usersController.getUsers);

// GET: get a user by id (ADMIN ONLY)
usersRouter.get("/:id", authenticateAdmin, usersController.getUserById);

// PUT: update a user by id
usersRouter.put("/:id", validateIdParam, usersUpdateMiddleware, usersController.updateUserById);

// DELETE: delete a user by id (ADMIN ONLY)
usersRouter.delete("/:id", authenticateAdmin, usersController.deleteUserById);

export default usersRouter;
