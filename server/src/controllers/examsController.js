import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Faculty, Department, Course } from "../models/categoriesModels.js";
import { uploadFile, getPresignedUrl } from "../utils/s3.js";
import { paginateAndSort, paginateWithCustomSort } from "../utils/paginationUtils.js";

/**
 * Controller for handling exam operations.
 */
const examsController = {
  /**
   * Get exams.
   * Supports filtering, sorting, and pagination.
   *
   * @async
   * @function getExams
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The paginated list of exams.
   * @throws {Error} If an error occurs while fetching the exams.
   */
  getExams: async (req, res) => {
    try {
      const {
        course, // Course ID
        years, // Array of years
        semesters, // Array of semesters
        terms, // Array of terms
        type, // Exam type (quiz, test)
        minGrade, // Minimum grade (0-100)
        lecturers, // Array of lecturers
        tags, // Array of tags
        minRating, // Minimum difficulty rating (0-5)
        uploadedBy, // User ID
        favoritesOnly, // Boolean
        sortBy, // Sort by field
        sortOrder, // Sort direction
      } = req.query;

      // Filter
      const query = {};
      if (course) query["course"] = course;
      if (years) query["year"] = { $in: years.split(",").map((year) => parseInt(year)) };
      if (semesters) query["semester"] = { $in: semesters.split(",").map((semester) => parseInt(semester)) };
      if (terms) query["term"] = { $in: terms.split(",").map((term) => parseInt(term)) };
      if (type) query["type"] = type;
      if (minGrade) query["grade"] = { $gte: minGrade };
      if (lecturers) query["lecturers"] = { $elemMatch: { $in: lecturers.split(",") } };
      if (tags) query["tags"] = { $elemMatch: { $in: tags.split(",") } };
      if (minRating) {
        const avgRating = await Exam.aggregate([
          { $match: { difficultyRatings: { $exists: true, $ne: [] } } },
          { $unwind: "$difficultyRatings" },
          { $group: { _id: "$_id", avgRating: { $avg: "$difficultyRatings.rating" } } },
          { $match: { avgRating: { $gte: parseInt(minRating) } } },
        ]);
        query["_id"] = { $in: avgRating.map((rating) => rating._id) };
      }
      if (uploadedBy) query["uploadedBy"] = uploadedBy;
      if (favoritesOnly === "true") {
        const user = await User.findById(req.user.user_id);
        query["_id"] = { $in: user.favorite_exams };
      }

      let result;

      if (sortBy === "rating") {
        result = await paginateWithCustomSort(
          Exam,
          query,
          req,
          (a, b) =>
            (sortOrder === "desc" ? -1 : 1) *
            (a.difficultyRatings.reduce((acc, rating) => acc + rating.rating, 0) / a.difficultyRatings.length -
              b.difficultyRatings.reduce((acc, rating) => acc + rating.rating, 0) / b.difficultyRatings.length)
        );
      } else if (sortBy === "favorites") {
        const user = await User.findById(req.user.user_id);
        result = await paginateWithCustomSort(
          Exam,
          query,
          req,
          (a, b) =>
            (sortOrder === "desc" ? -1 : 1) *
            (user.favorite_exams.includes(b._id) - user.favorite_exams.includes(a._id))
        );
      } else if (sortBy === "course-name") {
        result = await paginateWithCustomSort(
          Exam,
          query,
          req,
          (a, b) => (sortOrder === "desc" ? -1 : 1) * a.course.name.localeCompare(b.course.name)
        );
      } else if (sortBy === "course-code") {
        result = await paginateWithCustomSort(
          Exam,
          query,
          req,
          (a, b) => (sortOrder === "desc" ? -1 : 1) * a.course.code.localeCompare(b.course.code)
        );
      } else {
        result = await paginateAndSort(Exam, query, req);
      }

      return res.json(result);
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
      const exam = await Exam.findById(req.params.id);

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

      // Validate faculty, department, course, and exam existence with lower grade

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
      if (existingExam && existingExam.grade <= grade) {
        return res.status(409).json({ type: "ExamExistsError", message: "Exam already exists with lower grade" });
      }

      // Validate other fields
      if (grade < 0 || grade > 100) {
        return res.status(400).json({ type: "InvalidGradeError", message: "Grade must be between 0 and 100" });
      }
      if (difficultyRating < 0 || difficultyRating > 5) {
        return res.status(400).json({ type: "InvalidRatingError", message: "Rating must be between 0 and 5" });
      }
      if (year < 2000 || year > new Date().getFullYear()) {
        return res
          .status(400)
          .json({ type: "InvalidYearError", message: "Year must be between 2000 and current year" });
      }
      if (semester < 1 || semester > 3) {
        return res.status(400).json({ type: "InvalidSemesterError", message: "Semester must be between 1 and 3" });
      }
      if (term < 1 || term > 3) {
        return res.status(400).json({ type: "InvalidTermError", message: "Term must be between 1 and 3" });
      }
      if (type !== "quiz" && type !== "test") {
        return res.status(400).json({ type: "InvalidTypeError", message: "Type must be quiz or test" });
      }
      if (lecturers) {
        if (!Array.isArray(lecturers)) {
          return res.status(400).json({ type: "InvalidLecturersError", message: "Lecturers must be an array" });
        }
        if (lecturers.some((lecturer) => lecturer.trim().length < 2 || lecturer.trim().length > 20)) {
          return res
            .status(400)
            .json({ type: "LecturerInvalidError", message: "Lecturer name must be between 2 and 20 characters" });
        }
      }
      if (tags) {
        if (!Array.isArray(tags)) {
          return res.status(400).json({ type: "InvalidTagsError", message: "Tags must be an array" });
        }
        if (tags.some((tag) => tag.trim().length < 2 || tag.trim().length > 20)) {
          return res.status(400).json({ type: "TagInvalidError", message: "Tag must be between 2 and 20 characters" });
        }
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
   * To rate an exam, use the rateExam action instead.
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
      const exam = await Exam.findById(req.params.id);

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
