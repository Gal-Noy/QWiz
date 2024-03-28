import { Exam } from "../models/examModel.js";

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
    const exam = new Exam({
      ...req.body,
    });
    try {
      const newExam = await exam.save();
      res.status(201).json(newExam);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      await exam.remove();
      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default examsController;
