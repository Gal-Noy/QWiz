import React from "react";

function ExamRow({ examT }) {
  const exam = {
    difficultyRating: {
      totalRatings: 0,
      averageRating: 0,
    },
    _id: "660d11db42dc9abf01c4939c",
    s3Path:
      "https://qwiz-exams-bucket.s3.amazonaws.com/%D7%9E%D7%93%D7%A2%D7%99%20%D7%94%D7%98%D7%91%D7%A2/%D7%9E%D7%93%D7%A2%D7%99%20%D7%94%D7%9E%D7%97%D7%A9%D7%91/%D7%9E%D7%91%D7%95%D7%90%20%D7%9C%D7%9E%D7%93%D7%A2%D7%99%20%D7%94%D7%9E%D7%97%D7%A9%D7%91%0D/202.1.1011-2024-1-1.pdf",
    faculty: "660c5a76820b4a6d23ec5fe4",
    department: "660c5a76820b4a6d23ec5fe7",
    course: "660c5a76820b4a6d23ec5feb",
    year: 2024,
    semester: 1,
    term: 1,
    type: "test",
    grade: 85,
    lecturers: "",
    __v: 0,
  };
  return (
    <div className="exam-row">
      <div className="table-element favorite">X</div>
      <div className="table-element course-num">123123123</div>
      <div className="table-element course-name"> HAHAHAHA HHAHAHHHAHAHHHAHAH HHAHAH AHAH AHAHAHAHAHAHHAHAHAHAHAHA</div>
      <div className="table-element lecturers">HAHAHAHAHHAHAHAHAHAHA</div>
      <div className="table-element type">בוחן</div>
      <div className="table-element year">2014</div>
      <div className="table-element semester">א'</div>
      <div className="table-element term">קיץ</div>
      <div className="table-element grade">90</div>
      <div className="table-element rank">X X X X X</div>
    </div>
  );
}

export default ExamRow;
