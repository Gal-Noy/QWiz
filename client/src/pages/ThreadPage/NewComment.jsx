import React, { useState } from "react";
import ContentArea from "../../components/ContentArea/ContentArea";

/**
 * The new comment component.
 *
 * @component
 * @param {Object} props The component props.
 * @param {string} props.currReplied The current replied comment ID.
 * @param {Function} props.setCurrReplied The function to set the current replied comment ID.
 * @param {Object} props.newComment The new comment object.
 * @param {Function} props.setNewComment The function to set the new comment object.
 * @param {Function} props.addComment The function to add a new comment.
 * @returns {JSX.Element} The rendered NewComment component.
 */
function NewComment(props) {
  const { currReplied, setCurrReplied, newComment, setNewComment, addComment } = props;
  const [isPending, setIsPending] = useState(false);

  /**
   * Adds a new comment.
   *
   * @async
   * @function addNewComment
   * @returns {Promise<void>} The result of adding a new comment.
   */
  const addNewComment = async () => {
    if (isPending) return;
    await addComment(setIsPending);
  };

  return (
    <div className="new-comment">
      <a className="new-comment-title">
        {currReplied ? "תגובה ישירה" : "תגובה חדשה לדיון"}
        {currReplied && (
          <span className="material-symbols-outlined close-btn" onClick={() => setCurrReplied(null)}>
            close
          </span>
        )}
      </a>
      <ContentArea content={newComment} setContent={setNewComment} />
      <button className="new-comment-button" onClick={addNewComment}>
        {!isPending ? (
          <span className="material-symbols-outlined">reply</span>
        ) : (
          <div className="lds-dual-ring" id="new-comment-loading"></div>
        )}
      </button>
    </div>
  );
}

export default NewComment;
