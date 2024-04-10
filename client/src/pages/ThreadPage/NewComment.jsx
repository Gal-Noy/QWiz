import React from "react";
import ContentArea from "../../components/ContentArea/ContentArea";

function NewComment(props) {
  const { replyingTo, setReplyingTo, newComment, setNewComment, addComment } = props;

  return (
    <div className="new-comment">
      <a className="new-comment-title">
        {replyingTo ? "תגובה ישירה" : "תגובה חדשה לדיון"}
        {replyingTo && (
          <span className="material-symbols-outlined close-btn" onClick={() => setReplyingTo(null)}>
            close
          </span>
        )}
      </a>
      <ContentArea content={newComment} setContent={setNewComment} />
      <div className="new-comment-buttons">
        <button className="new-comment-button" onClick={addComment}>
          שלח
        </button>
      </div>
    </div>
  );
}

export default NewComment;
