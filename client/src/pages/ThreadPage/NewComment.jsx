import React, { useState } from "react";
import ContentArea from "../../components/ContentArea/ContentArea";

function NewComment(props) {
  const { replyingTo, setReplyingTo, newComment, setNewComment, addComment } = props;
  const [isPending, setIsPending] = useState(false);

  const addNewComment = async () => {
    if (isPending) return;
    setIsPending(true);
    await addComment();
    setIsPending(false);
  };

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
      <button className="new-comment-button" onClick={addNewComment}>
        {!isPending ? <span className="material-symbols-outlined">reply</span> : <div className="lds-dual-ring">aaa</div>}
      </button>
    </div>
  );
}

export default NewComment;
