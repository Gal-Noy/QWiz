import React from "react";
import { examToString, formatDate, mapTags } from "../../utils/generalUtils";
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
      <div className="table-element row starred" onClick={(e) => e.stopPropagation()}>
        <StarToggle threadId={thread._id} />
      </div>
      <div className="table-element row isClosed">
        {thread.isClosed ? (
          <span className="material-symbols-outlined">lock</span>
        ) : (
          <span className="material-symbols-outlined">lock_open</span>
        )}
      </div>
      {exam && (
        <div className="table-element row exam">
          <a>{examToString(exam)}</a>
        </div>
      )}
      <div className="table-element row title">{thread.title}</div>
      <div className="table-element row creator">{thread.creator.name}</div>
      <div className="table-element row createdAt">{formatDate(thread.createdAt)}</div>
      <div className="table-element row views">
        <span className="material-symbols-outlined">visibility</span>
        {thread.views}
      </div>
      <div className="table-element row comments">
        <span className="material-symbols-outlined">chat_bubble_outline</span>
        {thread.comments.length}
      </div>
      <div className="table-element row lastComment">
        {thread.comments.length > 0 && <a>{thread.comments[thread.comments.length - 1].sender.name}</a>}
        {thread.comments.length > 0 && <a>{formatDate(thread.comments[thread.comments.length - 1].createdAt)}</a>}
      </div>
      <div className="table-element row tags">{mapTags(thread.tags)}</div>
    </div>
  );
}

export default ThreadRow;
