import React from "react";
import ExamRating from "../../components/ExamRating/ExamRating";
import { examToStringVerbose } from "../../utils/generalUtils";

/**
 * A component for displaying an exam block in the free search page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.exam - The exam object.
 * @returns {JSX.Element} The FreeSearchExamBlock component.
 */
function FreeSearchExamBlock({ exam }) {
  return (
    <li className="free-search-list-item" key={exam._id} onClick={() => (window.location.href = `/exam/${exam._id}`)}>
      <div className="free-search-list-item-main-details">
        <a>{examToStringVerbose(exam)}</a>
      </div>
      <div className="free-search-list-item-secondary-details">
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">מחלקה: </a>
          <a className="secondary-details-pair-value">{exam.course.department.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">פקולטה: </a>
          <a className="secondary-details-pair-value">{exam.course.department.faculty.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">הועלה ע"י: </a>
          <a className="secondary-details-pair-value">{exam.uploadedBy.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">דירוג קושי: </a>
          <ExamRating exam={exam} editMode={false} />
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">מרצים: </a>
          <a className="secondary-details-pair-value">{exam.lecturers.join(", ")}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">תגיות: </a>
          <a className="secondary-details-pair-value">{mapTags(exam.tags)}</a>
        </div>
      </div>
    </li>
  );
}

export default FreeSearchExamBlock;
