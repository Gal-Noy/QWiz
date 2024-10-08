import React from "react";
import { mapTags } from "../../utils/generalUtils";
import FavoriteToggle from "../FavoriteToggle/FavoriteToggle";
import ExamRating from "../ExamRating/ExamRating";

/**
 * Renders a row for an exam in the exams list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.exam - The exam object.
 * @param {boolean} props.isProfilePage - Indicates whether the component is rendered on the profile page.
 * @returns {JSX.Element} The rendered ExamRow component.
 */
function ExamRow(props) {
  const { exam, isProfilePage } = props;

  return (
    <div
      className={"exam-row" + (isProfilePage ? " is-profile-page" : "")}
      onClick={() => {
        window.location.href = `/exam/${exam._id}`;
      }}
    >
      <div className="table-element favorites" onClick={(e) => e.stopPropagation()}>
        <FavoriteToggle examId={exam._id} />
      </div>
      <div className="table-element row course-code">{exam.course.code}</div>
      <div className="table-element row course-name">{exam.course.name}</div>
      <div className="table-element row lecturers">{exam.lecturers.join(", ")}</div>
      <div className="table-element row type">{exam.type === "test" ? "מבחן" : "בוחן"}</div>
      <div className="table-element row year">{exam.year}</div>
      <div className="table-element row semester">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "קיץ"}</div>
      <div className="table-element row term">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}</div>
      <div className="table-element row grade">{exam.grade}</div>
      <div className="table-element row rating">
        <ExamRating exam={exam} editMode={false} />
      </div>
      <div className="table-element row tags">{mapTags(exam.tags)}</div>
    </div>
  );
}

export default ExamRow;
