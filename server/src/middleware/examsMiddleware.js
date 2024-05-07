import mongoose from "mongoose";
import { deleteFile } from "../utils/s3.js";
import { Thread } from "../models/threadModels.js";
import { User } from "../models/userModel.js";
import examsController from "../controllers/examsController.js";

/**
 * Middleware to validate the ID parameter
 *
 * @function validateIdParam
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Callback function
 * @returns {void}
 * @throws {InvalidIDError} - Invalid ID
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    switch (id) {
      case "uploaded": {
        return examsController.getUploadedExams(req, res);
      }
      case "favorites": {
        return examsController.getFavoriteExams(req, res);
      }
      default: {
        return res.status(400).json({ type: "InvalidIDError", message: "Invalid ID." });
      }
    }
  }
  next();
};

/**
 * Middleware to delete an exam
 *
 * @async
 * @function deleteExam
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteExam = async function (next) {
  const examToDelete = await this.model.findOne(this.getQuery());
  const { _id: examId, s3Key } = examToDelete;

  try {
    await deleteFile(s3Key);

    await Thread.deleteMany({ exam: examId });

    await User.updateMany({ favorite_exams: examId }, { $pull: { favorite_exams: examId } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to delete multiple exams
 *
 * @async
 * @function deleteExams
 * @param {Function} next - Callback function
 * @returns {void}
 */
const deleteExams = async function (next) {
  const examsToDelete = await this.model.find(this.getQuery());
  const examIds = examsToDelete.map((exam) => exam._id);

  try {
    await Thread.deleteMany({ exam: { $in: examIds } });

    await User.updateMany({ favorite_exams: { $in: examIds } }, { $pull: { favorite_exams: { $in: examIds } } });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to populate the exam
 *
 * @function populateExam
 * @param {Function} next - Callback function
 * @returns {void}
 */
const populateExam = function (next) {
  this.populate({
    path: "course",
    select: "name code tags",
    populate: {
      path: "department",
      select: "name",
      populate: {
        path: "faculty",
        select: "name",
      },
    },
  });
  this.populate({
    path: "uploadedBy",
    select: "name",
  });
  next();
};

export { validateIdParam, deleteExam, deleteExams, populateExam };
