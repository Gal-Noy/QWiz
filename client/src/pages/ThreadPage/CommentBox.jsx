import React, { useState, useEffect } from "react";
import { formatDateAndTime } from "../../utils/generalUtils";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import NewComment from "./NewComment";
import "./CommentBox.css";

function CommentBox(props) {
  const { comment, replyingTo, setReplyingTo, newComment, setNewComment, addComment, nest, expand } = props;
  const { _id, title, content, sender, createdAt, likes, replies } = comment;
  const [isExpanded, setIsExpanded] = useState(expand);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.includes(JSON.parse(localStorage.getItem("user"))._id));

  useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  const toggleLikeComment = async () => {
    await axiosInstance
      .put(`/threads/comment/${_id}/like`)
      .then((res) =>
        handleResult(res, 200, () => {
          setLikesCount(res.data.likes.length);
          setIsLiked(!isLiked);
        })
      )
      .catch((err) => handleError(err, () => alert("אירעה שגיאה בעת עדכון הלייק")));
  };

  return (
    <div className="comment-box-container">
      <div className="comment-box">
        <div className={"comment-box-header " + (nest % 3 === 0 ? "" : nest % 3 === 1 ? "first-nest" : "second-nest")}>
          <div className="comment-sender">
            <img className="comment-sender-avatar" src={defaultAvatar} alt="avatar" />
            <a className="comment-sender-name">{sender.name}</a>
          </div>
          <a className="comment-title">{title}</a>
          <div className="comment-header-left-section">
            <a className="comment-createdAt">{formatDateAndTime(createdAt)}</a>
            <a className="comment-expand-button" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <span className="material-symbols-outlined">expand_less</span>
              ) : (
                <span className="material-symbols-outlined">expand_more</span>
              )}
            </a>
          </div>
        </div>
        {isExpanded && (
          <>
            <div className="comment-content" dangerouslySetInnerHTML={{ __html: content }} />
            <div className={"comment-footer " + (nest % 3 === 0 ? "" : nest % 3 === 1 ? "first-nest" : "second-nest")}>
              <a className="comment-likes">
                {likesCount}
                <span
                  onClick={toggleLikeComment}
                  className={(isLiked ? "material-icons" : "material-symbols-outlined") + " like-button"}
                >
                  thumb_up
                </span>
              </a>
              <div className="comment-reply-section">
                <button className="add-comment-reply-button" onClick={() => setReplyingTo(_id)}>
                  הגב
                </button>
                <a className="comment-replies">
                  {replies.length}
                  <span className="material-symbols-outlined">reply</span>
                </a>
              </div>
            </div>
          </>
        )}
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
          nest={nest + 1}
          expand={expand}
        />
      ))}
    </div>
  );
}

export default CommentBox;
