const formatDate = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("he-IL", options);
};

const formatDateAndTime = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(date).toLocaleDateString("he-IL", options);
};

const examToString = (exam) => {
  return `${exam.course.name} - ${exam.year} - ${exam.type === "test" ? "מבחן" : "בוחן"} - ${
    exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"
  } - ${exam.term === 1 ? "א'" : exam.term === 2 ? "ב'" : "ג'"}`;
};

const sumComments = (comments) => {
  let sum = comments.length;
  comments.forEach((comment) => {
    sum += sumComments(comment.replies);
  });
  return sum;
};

export { formatDate, formatDateAndTime, examToString, sumComments };
