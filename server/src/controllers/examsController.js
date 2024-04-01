import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Faculty, Department, Course } from "../models/catalogModels.js";
import { uploadFile } from "../utils/s3.js";

const examsController = {
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createExam: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const examData = JSON.parse(req.body.examData);
      if (!examData) {
        return res.status(400).json({ message: "Please provide exam data" });
      }

      const {
        faculty,
        department,
        course,
        year,
        semester,
        term,
        type,
        grade,
        lecturers,
        difficultyRating,
        phone_number,
        id_number,
      } = examData;

      if (!faculty || !department || !course || !year || !semester || !term || !type || !phone_number || !id_number) {
        return res.status(400).json({
          message:
            "Please provide faculty, department, course, year, semester, term, type, phone number and id number.",
        });
      }

      let existingFaculty = await Faculty.findOne({ name: faculty });
      if (!existingFaculty) {
        const newFaculty = new Faculty({ name: faculty });
        await newFaculty.save();
        existingFaculty = newFaculty;
      }

      let existingDepartment = await Department.findOne({ name: department, faculty: existingFaculty._id });
      if (!existingDepartment) {
        const newDepartment = new Department({ name: department, faculty: existingFaculty._id });
        await newDepartment.save();
        existingDepartment = newDepartment;
      }

      const { name: courseName, code: courseCode } = course;
      let existingCourse = await Course.findOne({
        $or: [{ name: courseName }, { code: courseCode }],
      });
      if (!existingCourse) {
        const newCourse = new Course({ name: courseName, code: courseCode, department: existingDepartment._id });
        await newCourse.save();
        existingCourse = newCourse;
      }

      const existingExam = await Exam.findOne({ course: existingCourse._id, year, semester, term });
      if (existingExam) {
        return res.status(400).json({ message: "Exam already exists" });
      }

      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const fileKey = `${existingFaculty.name}/${existingDepartment.name}/${existingCourse.name}/${
        existingCourse.code
      }-${year}-${semester}-${term}.${fileType.split("/")[1]}`;
      //const s3Path = await uploadFile(fileContent, fileKey, fileType);
      const s3Path = "path/to/s3/file";

      const totalRatings = difficultyRating ? 1 : 0;
      const averageRating = difficultyRating ?? 0;
      const exam = new Exam({
        s3Path,
        faculty: existingFaculty._id,
        department: existingDepartment._id,
        course: existingCourse._id,
        year: parseInt(year),
        semester: parseInt(semester),
        term: parseInt(term),
        type: parseInt(type),
        grade: parseInt(grade),
        lecturers,
        difficultyRating: { totalRatings, averageRating },
      });

      // Handle user
      if (req.user) {
        const dbUser = await User.findById(req.user._id);

        if (dbUser.phone_number !== phone_number || dbUser.id_number !== id_number) {
          dbUser.phone_number = phone_number;
          dbUser.id_number = id_number;
        }
        dbUser.uploaded_exams.push(exam._id);

        await dbUser.save();
      }

      const newExam = await exam.save();
      res.status(201).json(newExam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLastExams: async (req, res) => {
    try {
      const { page } = req.params ?? 1;
      const exams = await Exam.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .skip(10 * (page - 1));
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourseExams: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const exams = await Exam.find({ course: course._id });
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  filterExams: async (req, res) => {
    try {
      const { faculty, department, course, year, semester, term, type, grade, lecturers, difficultyRating } = req.body;

      if (!faculty || !department || !course) {
        return res.status(400).json({ message: "Please provide faculty, department, and course" });
      }

      const filter = {};

      const existingFaculty = await Faculty.findOne({ name: faculty });
      if (!existingFaculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      filter.faculty = existingFaculty._id;

      const existingDepartment = await Department.findOne({ name: department, faculty: existingFaculty._id });
      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      filter.department = existingDepartment._id;

      const existingCourse = await Course.findOne({
        name: course,
        department: existingDepartment._id,
      });
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      filter.course = existingCourse._id;

      if (year) filter.year = year;
      if (semester) filter.semester = semester;
      if (term) filter.term = term;
      if (type) filter.type = type;
      if (grade) filter.grade = { $gte: grade }; // greater than or equal
      if (lecturers) filter.lecturers = lecturers;
      if (difficultyRating) filter.difficultyRating.averageRating = { $gte: difficultyRating }; // greater than or equal

      const exams = await Exam.find(filter);
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getExamById: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateExam: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      exam.set(req.body);
      const updatedExam = await exam.save();
      res.json(updatedExam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteExam: async (req, res) => {
    try {
      await Exam.findByIdAndDelete(req.params.id);
      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default examsController;
