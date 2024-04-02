import fs from "fs";

const init = async () => {
  const data = fs.readFileSync("./courses.txt", "utf8");
  const courses = data.split("\n");

  const coursesJsons = courses.map((line) => {
    const [code, faculty, department, name] = line.split("\t");
    return { code, name, department, faculty };
  });

  const sortedCourses = coursesJsons.reduce((acc, course) => {
    const { department, faculty, ...courseWithoutDeptAndFaculty } = course;
    if (faculty && department) {
      if (!acc[faculty]) {
        acc[faculty] = {};
      }
      if (!acc[faculty][department]) {
        acc[faculty][department] = [];
      }
      acc[faculty][department].push(courseWithoutDeptAndFaculty);
    }
    return acc;
  }, {});

  fs.writeFileSync("./courses.json", JSON.stringify(sortedCourses, null, 2));
};

init();
