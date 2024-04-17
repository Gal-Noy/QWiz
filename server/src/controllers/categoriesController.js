import { Faculty, Department, Course } from "../models/categoriesModels.js";

const categoriesController = {
  // Faculties

  getFaculties: async (req, res) => {
    try {
      const faculties = await Faculty.find();

      return res.json(faculties);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getFacultyById: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createFaculty: async (req, res) => {
    try {
      const faculty = new Faculty(req.body);

      await faculty.save();
      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      faculty.set(req.body);
      await faculty.save();

      return res.json(faculty);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findByIdAndDelete(req.params.id);

      if (!faculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }

      return res.json({ message: "Faculty deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Departments

  getDepartments: async (req, res) => {
    try {
      const departments = await Department.find();

      return res.json(departments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createDepartment: async (req, res) => {
    try {
      const department = new Department(req.body);

      await department.save();

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      department.set(req.body);
      await department.save();

      return res.json(department);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);

      if (!department) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }

      return res.json({ message: "Department deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Courses

  getCourses: async (req, res) => {
    try {
      const courses = await Course.find();

      return res.json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createCourse: async (req, res) => {
    try {
      const course = new Course(req.body);

      await course.save();

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      course.set(req.body);
      await course.save();

      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      return res.json({ message: "Course deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Filters

  getFacultyDepartments: async (req, res) => {
    try {
      const departments = await Department.find({ faculty: req.params.id });

      return res.json(departments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getDepartmentCourses: async (req, res) => {
    try {
      const courses = await Course.find({ department: req.params.id });

      return res.json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default categoriesController;
