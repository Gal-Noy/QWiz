import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to handle pagination
 * 
 * @function paginationMiddleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Callback function
 * @returns {void}
 */
const paginationMiddleware = (req, res, next) => {
  const { page, sortBy, sortOrder } = req.query;

  const pageNum = parseInt(page) || 1;
  const pageSize = process.env.PAGE_SIZE || 10;

  req.pagination = {
    pageNum,
    pageSize,
  };

  const sortField = sortBy || "createdAt";
  const sortDirection = sortOrder === "desc" ? -1 : 1; // Default is ascending

  req.sort = {
    [sortField]: sortDirection,
  };

  next();
};

export { paginationMiddleware };
