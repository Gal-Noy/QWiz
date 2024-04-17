import React from "react";
import { formatDate, mapTags } from "../../utils/generalUtils";
import StarToggle from "../StarToggle/StarToggle";

/**
 * Renders a row for a thread in the threads list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.thread - The thread object.
 * @param {Object} props.exam - The exam object.
 * @param {boolean} props.isProfilePage - Indicates whether the component is rendered on the profile page.
 * @returns {JSX.Element} The rendered ThreadRow component.
 */
function ThreadRow(props) {
  const { thread, exam, isProfilePage } = props;

  return (
    <div
      className={"thread-row" + (isProfilePage ? " is-profile-page" : "")}
      onClick={() => {
        window.location.href = `/thread/${thread._id}`;
      }}
    >
      <div className="table-element starred row" onClick={(e) => e.stopPropagation()}>
        <StarToggle threadId={thread._id} />
      </div>
      <div className="table-element isClosed row">
        {thread.isClosed ? (
          <span className="material-symbols-outlined">lock</span>
        ) : (
          <span className="material-symbols-outlined">lock_open</span>
        )}
      </div>
      {exam && (
        <div className="table-element exam row">
          <a>
            {exam.course.name} - {exam.year}
          </a>
          <a>
            {exam.type === "test" ? "מבחן" : "בוחן"} - {exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}{" "}
            - {exam.term === 1 ? "א'" : exam.term === 2 ? "ב'" : "ג'"}
          </a>
        </div>
      )}
      <div className="table-element title">{thread.title}</div>
      <div className="table-element creator">{thread.creator.name}</div>
      <div className="table-element createdAt">{formatDate(thread.createdAt)}</div>
      <div className="table-element views row">
        <span className="material-symbols-outlined">visibility</span>
        {thread.views}
      </div>
      <div className="table-element comments row">
        <span className="material-symbols-outlined">chat_bubble_outline</span>
        {thread.comments.length}
      </div>
      <div className="table-element lastComment row">
        {thread.comments.length > 0 && <a>{thread.comments[thread.comments.length - 1].sender.name}</a>}
        {thread.comments.length > 0 && <a>{formatDate(thread.comments[thread.comments.length - 1].createdAt)}</a>}
      </div>
      <div className="table-element tags">{mapTags(thread.tags)}</div>
    </div>
  );
}

export default ThreadRow;
