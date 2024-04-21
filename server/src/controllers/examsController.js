import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Faculty, Department, Course } from "../models/categoriesModels.js";
import { uploadFile, getPresignedUrl } from "../utils/s3.js";

/**
 * Controller for handling exam operations.
 */
const examsController = {
  /////////////////////////// EXAMS CRUD ///////////////////////////

  /**
   * Get all exams.
   * Only admins can access this route.
   *
   * @async
   * @function getAllExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of exams.
   * @throws {Error} If an error occurs while fetching the exams.
   */
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find().select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Get an exam by ID.
   *
   * @async
   * @function getExamById
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam} The exam.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {Error} If an error occurs while fetching the exam.
   */
  getExamById: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id).select("-s3Key");

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      return res.json(exam);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Create a new exam.
   *
   * @async
   * @function createExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The created exam and the user.
   * @throws {FileNotUploadedError} If no file is provided.
   * @throws {MissingFieldsError} If exam data is missing.
   * @throws {FacultyNotFoundError} If the faculty is not found.
   * @throws {DepartmentNotFoundError} If the department is not found.
   * @throws {CourseNotFoundError} If the course is not found.
   * @throws {ExamExistsError} If the exam already exists.
   * @throws {PhoneNumberError} If the phone number is invalid.
   * @throws {PhoneNumberLengthError} If the phone number is less than 9 digits long.
   * @throws {IDNumberError} If the ID number is invalid.
   * @throws {Error} If an error occurs while creating the exam.
   */
  createExam: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ type: "FileNotUploadedError", message: "Please provide a file" });
      }

      const examData = JSON.parse(req.body.examData);
      if (!examData) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide exam data" });
      }

      const {
        // Mandatory fields
        faculty,
        department,
        course,
        year,
        semester,
        term,
        type,
        grade,
        // Optional fields
        lecturers,
        tags,
        difficultyRating,
        // User mandatory fields
        phone_number,
        id_number,
      } = examData;

      if (!faculty || !department || !course || !year || !semester || !term || !type || !phone_number || !id_number) {
        return res.status(400).json({
          type: "MissingFieldsError",
          message: "Please provide faculty, department, course, year, semester, term, type, and full contact details.",
        });
      }

      // Validate faculty, department, course, and exam existence

      const existingFaculty = await Faculty.findById(faculty._id);
      if (!existingFaculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }
      const existingDepartment = await Department.findOne({ name: department.name, faculty: faculty._id });
      if (!existingDepartment) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }
      const existingCourse = await Course.findOne({ name: course.name, department: department._id });
      if (!existingCourse) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }
      const existingExam = await Exam.findOne({ course, year, semester, term });
      if (existingExam) {
        return res.status(400).json({ type: "ExamExistsError", message: "Exam already exists" });
      }

      // Handle user

      const dbUser = await User.findById(req.user.user_id);

      // Validate phone_number, id_number
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

      // Update user details if necessary
      if (
        !dbUser.phone_number ||
        !dbUser.id_number ||
        dbUser.phone_number !== phone_number ||
        dbUser.id_number !== id_number
      ) {
        dbUser.phone_number = phone_number;
        dbUser.id_number = id_number;
        await dbUser.save();
      }

      // Update course tags and lecturers if necessary

      if (tags && tags.length > 0) {
        existingCourse.tags = [...new Set([...existingCourse.tags, ...tags])];
        await existingCourse.save();
      }
      if (lecturers && lecturers.length > 0) {
        existingCourse.lecturers = [...new Set([...existingCourse.lecturers, ...lecturers])];
        await existingCourse.save();
      }

      // Upload file to S3

      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const s3Key = `${faculty.name}/${department.name}/${course.name}/${course.code}-${year}-${semester}-${term}.${
        fileType.split("/")[1]
      }`;
      await uploadFile(fileContent, s3Key, fileType);

      // Save exam

      const exam = new Exam({
        s3Key,
        course,
        year,
        semester,
        term,
        type,
        grade,
        lecturers: lecturers ? lecturers : [],
        tags: tags ? tags : [],
        difficultyRatings: difficultyRating > 0 ? [{ user: req.user.user_id, rating: difficultyRating }] : [],
        uploadedBy: req.user.user_id,
      });

      const newExam = await exam.save();
      delete newExam.s3Key;

      const response = {
        exam: newExam,
        user: dbUser,
      };

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Update an exam by ID.
   * Only admins can update exams.
   *
   * @async
   * @function updateExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam} The updated exam.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {Error} If an error occurs while updating the exam.
   */
  updateExam: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      exam.set(req.body);
      const updatedExam = await exam.save();

      delete updatedExam.s3Key;

      return res.json(updatedExam);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Delete an exam by ID.
   * Only admins can delete exams.
   *
   * @async
   * @function deleteExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The success message.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {Error} If an error occurs while deleting the exam.
   */
  deleteExam: async (req, res) => {
    try {
      const exam = await Exam.findByIdAndDelete(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      return res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /////////////////////////// EXAMS SEARCH ///////////////////////////

  /**
   * Get exams by user ID.
   * Only admins can access this route.
   *
   * @async
   * @function getUserExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of exams.
   * @throws {UserNotFoundError} If the user is not found.
   * @throws {Error} If an error occurs while fetching the exams.
   */
  getUserExams: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ type: "UserNotFoundError", message: "User not found" });
      }

      const exams = await Exam.find({ uploadedBy: req.params.id }).select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Get exams by course ID.
   *
   * @async
   * @function getCourseExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of exams.
   * @throws {CourseNotFoundError} If the course is not found.
   * @throws {Error} If an error occurs while fetching the exams.
   */
  getCourseExams: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      const exams = await Exam.find({ course: course._id }).select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Get exams uploaded by the user.
   *
   * @async
   * @function getUploadedExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of exams.
   * @throws {Error} If an error occurs while fetching the exams.
   */
  getUploadedExams: async (req, res) => {
    try {
      const exams = await Exam.find({ uploadedBy: req.user.user_id }).select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Get favorite exams.
   *
   * @async
   * @function getFavoriteExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of favorite exams.
   * @throws {Error} If an error occurs while fetching the favorite exams.
   */
  getFavoriteExams: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id).populate({
        path: "favorite_exams",
        select: "-s3Key",
      });

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /////////////////////////// EXAMS ACTIONS ///////////////////////////

  /**
   * Get a presigned URL for an exam file.
   *
   * @async
   * @function getPresignedUrl
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The presigned URL.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {Error} If an error occurs while fetching the presigned URL.
   */
  getPresignedUrl: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      const presignedUrl = await getPresignedUrl(exam.s3Key);

      return res.json({ presignedUrl });
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Add an exam to favorites.
   *
   * @async
   * @function addFavoriteExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of favorite exams.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {Error} If an error occurs while adding the exam to favorites.
   */
  addFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      user.favorite_exams.push(exam._id);
      await user.save();

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Remove an exam from favorites.
   *
   * @async
   * @function removeFavoriteExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam[]} The list of favorite exams.
   * @throws {Error} If an error occurs while removing the exam from favorites.
   */
  removeFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const examId = req.params.id;

      user.favorite_exams = user.favorite_exams.filter((exam) => exam._id.toString() !== examId);
      await user.save();

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },

  /**
   * Rate an exam.
   *
   * @async
   * @function rateExam
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Exam} The rated exam.
   * @throws {ExamNotFoundError} If the exam is not found.
   * @throws {InvalidRatingError} If the rating is invalid.
   * @throws {Error} If an error occurs while rating the exam.
   */
  rateExam: async (req, res) => {
    try {
      const { rating } = req.body;
      const exam = await Exam.findById(req.params.id).select("-s3Key");

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      // Validate rating
      if (rating < 0 || rating > 5) {
        return res.status(400).json({ type: "InvalidRatingError", message: "Rating must be between 0 and 5" });
      }

      // Update rating if exists, otherwise add new rating
      const existingRating = exam.difficultyRatings.find((rating) => rating.user.toString() === req.user.user_id);
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        exam.difficultyRatings.push({ user: req.user.user_id, rating });
      }

      await exam.save();

      return res.json(exam);
    } catch (error) {
      return res.status(500).json({ type: "ServerError", message: error.message });
    }
  },
};

export default examsController;
