import React, { useState } from "react";
import ContentArea from "../../components/ContentArea/ContentArea";

function NewComment(props) {
  const { currReplied, setCurrReplied, newComment, setNewComment, addComment } = props;
  const [isPending, setIsPending] = useState(false);

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
