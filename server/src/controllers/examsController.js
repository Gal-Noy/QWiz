import { Exam } from "../models/examModel.js";
import { Faculty, Department, Course } from "../models/catalogModels.js";

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
      const { faculty, department, course, year, semester, term, type, grade, lecturers, difficultyRating } = req.body;

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
        name: courseName,
        code: courseCode,
        department: existingDepartment._id,
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

      const totalRatings = difficultyRating ? 1 : 0;
      const averageRating = difficultyRating ?? 0;
      const exam = new Exam({
        faculty: existingFaculty._id,
        department: existingDepartment._id,
        course: existingCourse._id,
        year,
        semester,
        term,
        type,
        grade,
        lecturers,
        difficultyRating: { totalRatings, averageRating },
      });

      const newExam = await exam.save();
      res.status(201).json(newExam);
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

  getLastExams: async (req, res) => {
    // get last 10 exams
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
};

export default examsController;
