import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

// POST: register user (create new user)
authRouter.post("/register", authController.register);

// POST: login user
authRouter.post("/login", authController.login);

// POST: logout user
authRouter.post("/logout", authenticateToken, authController.logout);

export default authRouter;
