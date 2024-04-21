import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import searchController from "../controllers/searchController.js";

const searchRouter = express.Router();
searchRouter.use(authenticateToken);

// GET: free search
searchRouter.get("/:query", searchController.freeSearch); // TODO: PS

export default searchRouter;
