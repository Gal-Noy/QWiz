import fs from "fs";

const init = async () => {
  const data = fs.readFileSync("./courses.txt", "utf8");
  const courses = data.split("\n");

  const coursesJsons = courses.map((line) => {
    const [code, faculty, department, name] = line.split("\t");
    return { code, name, department, faculty };
  });

  fs.writeFileSync("./courses.json", JSON.stringify(coursesJsons));
};

init();
