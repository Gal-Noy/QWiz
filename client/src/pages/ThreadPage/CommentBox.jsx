import React from "react";
import { formatDateAndTime } from "../../utils/generalUtils";
import defaultAvatar from "../../assets/default-avatar.jpg";
import NewComment from "./NewComment";
import "./CommentBox.css";

function CommentBox(props) {
  const { comment, replyingTo, setReplyingTo, newComment, setNewComment, addComment } = props;
  const { _id, title, content, sender, createdAt, likes, replies } = comment;

  return (
    <div className="comment-box-container">
      <div className="comment-box">
        <div className="comment-box-header">
          <div className="comment-sender">
            <img className="comment-sender-avatar" src={defaultAvatar} alt="avatar" />
            <a className="comment-sender-name">{sender.name}</a>
          </div>
          <a className="comment-title">{title}</a>
          <a className="comment-createdAt">{formatDateAndTime(createdAt)}</a>
        </div>
        <div className="comment-content" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="comment-footer">
          <a className="comment-likes">
            {likes.length}
            <span className="material-icons">thumb_up</span>
          </a>
          <button className="add-comment-reply-button" onClick={() => setReplyingTo(_id)}>
            הגב
          </button>
          <a className="comment-replies">
            {replies.length}
            <span className="material-icons">reply</span>
          </a>
        </div>
      </div>
      {replyingTo === _id && (
        <NewComment
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
        />
      )}
      {replies.map((reply) => (
        <CommentBox
          key={reply._id}
          comment={reply}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
        />
      ))}
    </div>
  );
}

export default CommentBox;
