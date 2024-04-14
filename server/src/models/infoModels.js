import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const deleteFaculty = async function (next) {
  const facultyId = this._conditions._id;

  try {
    await Department.deleteMany({ faculty: facultyId });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteFaculties = async function (next) {
  const facultiesToDelete = await this.model.find(this.getQuery());
  const facultyIds = facultiesToDelete.map((faculty) => faculty._id);

  try {
    await Department.deleteMany({ faculty: { $in: facultyIds } });

    next();
  } catch (error) {
    next(error);
  }
};

facultySchema.pre("findOneAndDelete", deleteFaculty);
facultySchema.pre("deleteOne", deleteFaculty);
facultySchema.pre("deleteMany", deleteFaculties);

export const Faculty = mongoose.model("Faculty", facultySchema);

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

const deleteDepartment = async function (next) {
  const departmentId = this._conditions._id;

  try {
    await Course.deleteMany({ department: departmentId });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteDepartments = async function (next) {
  const departmentsToDelete = await this.model.find(this.getQuery());
  const departmentIds = departmentsToDelete.map((department) => department._id);

  try {
    await Course.deleteMany({ department: { $in: departmentIds } });

    next();
  } catch (error) {
    next(error);
  }
};

departmentSchema.pre("findOneAndDelete", deleteDepartment);
departmentSchema.pre("deleteOne", deleteDepartment);
departmentSchema.pre("deleteMany", deleteDepartments);

const populateDepartment = function (next) {
  this.populate("faculty", "name");
  next();
};

departmentSchema.pre("findOne", populateDepartment);
departmentSchema.pre("find", populateDepartment);

export const Department = mongoose.model("Department", departmentSchema);

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const deleteCourse = async function (next) {
  const courseId = this._conditions._id;

  try {
    await Exam.deleteMany({ course: courseId });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteCourses = async function (next) {
  const coursesToDelete = await this.model.find(this.getQuery());
  const courseIds = coursesToDelete.map((course) => course._id);

  try {
    await Exam.deleteMany({ course: { $in: courseIds } });

    next();
  } catch (error) {
    next(error);
  }
};

courseSchema.pre("findOneAndDelete", deleteCourse);
courseSchema.pre("deleteOne", deleteCourse);
courseSchema.pre("deleteMany", deleteCourses);

const populateCourse = function (next) {
  this.populate("department", "name");
  next();
};

courseSchema.pre("findOne", populateCourse);
courseSchema.pre("find", populateCourse);

export const Course = mongoose.model("Course", courseSchema);
