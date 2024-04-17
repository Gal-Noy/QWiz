import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDateAndTime } from "../../utils/generalUtils";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import NewComment from "./NewComment";
import ContentArea from "../../components/ContentArea/ContentArea";
import { toast } from "react-custom-alert";
import "./CommentBox.css";

function CommentBox(props) {
  const {
    threadId,
    comment,
    currReplied,
    setCurrReplied,
    newComment,
    setNewComment,
    addComment,
    nest,
    expand,
    isClosed,
    replyTo,
  } = props;
  const { _id, title, content, sender, createdAt, likes, replies } = comment;
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = sender._id === user._id;
  const [isExpanded, setIsExpanded] = useState(expand);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.includes(user._id));
  const [likePending, setLikePending] = useState(false);

  useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  const toggleLikeComment = async () => {
    if (likePending) return;
    setLikePending(true);
    await axiosInstance
      .put(`/threads/comment/${_id}/like`)
      .then((res) =>
        handleResult(res, 200, () => {
          setLikesCount(res.data.likes.length);
          setIsLiked(!isLiked);
        })
      )
      .catch((err) => handleError(err, "שגיאה בעדכון הלייק"))
      .finally(() => setLikePending(false));
  };

  const allowReply = () => {
    if (isClosed) {
      toast.warning("הדיון נעול ולא ניתן להוסיף תגובות");
      return;
    }

    setCurrReplied(_id);
  };

  const [editMode, setEditMode] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState(content);
  const [editedCommentTitle, setEditedCommentTitle] = useState(title);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedCommentContent(content);
    setEditedCommentTitle(title);
  };

  const updateComment = async () => {
    if (editedCommentTitle === title && editedCommentContent === content) {
      toggleEditMode();
      return;
    }
    await axiosInstance
      .put(`/threads/comment/${_id}`, { title: editedCommentTitle, content: editedCommentContent })
      .then((res) =>
        handleResult(res, 200, () => {
          toast.success("התגובה עודכנה בהצלחה");
          setTimeout(() => window.location.reload(), 1000);
        })
      )
      .catch((err) => handleError(err, "אירעה שגיאה בעת עדכון התגובה"));
  };

  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}/thread/${threadId}/comment/${_id}`;
    navigator.clipboard.writeText(link);
    toast.info("הקישור הועתק ללוח");
  };

  return (
    <div className="comment-box-container" id={`comment-${comment._id}`}>
      <div className="comment-box">
        <div className={"comment-box-header " + (nest % 3 === 0 ? "" : nest % 3 === 1 ? "first-nest" : "second-nest")}>
          <div className="comment-sender">
            <img className="comment-sender-avatar" src={defaultAvatar} alt="avatar" />
            <a className="comment-sender-name">{sender.name}</a>
          </div>
          <div className="comment-title">
            {!editMode ? (
              <Link to={`/thread/${threadId}/comment/${replyTo}`} className="link-to-replyTo">
                {title}
              </Link>
            ) : (
              <input
                className="edit-comment-title-input"
                value={editedCommentTitle}
                onChange={(e) => setEditedCommentTitle(e.target.value)}
              />
            )}
          </div>
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
            {!editMode && <div className="comment-content" dangerouslySetInnerHTML={{ __html: content }} />}
            {editMode && <ContentArea content={editedCommentContent} setContent={setEditedCommentContent} />}
            <div className={"comment-footer " + (nest % 3 === 0 ? "" : nest % 3 === 1 ? "first-nest" : "second-nest")}>
              <div className="comment-buttons">
                <a className="comment-likes">
                  {likesCount}
                  {likePending ? (
                    <div className="lds-dual-ring" id="like-loading"></div>
                  ) : (
                    <span
                      onClick={toggleLikeComment}
                      className={(isLiked ? "material-icons" : "material-symbols-outlined") + " like-button"}
                    >
                      thumb_up
                    </span>
                  )}
                </a>{" "}
                <span className="material-symbols-outlined comment-link" onClick={copyLinkToClipboard}>
                  link
                </span>
              </div>
              <div className="comment-buttons">
                {isAdmin &&
                  (!editMode ? (
                    <button className="comment-button" onClick={toggleEditMode}>
                      ערוך
                    </button>
                  ) : (
                    <>
                      <button className="comment-button" onClick={toggleEditMode}>
                        בטל
                      </button>
                      <button className="comment-button" onClick={updateComment}>
                        שמור
                      </button>
                    </>
                  ))}
                <button className="comment-button" onClick={allowReply}>
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
      {!isClosed && currReplied === _id && (
        <NewComment
          currReplied={currReplied}
          setCurrReplied={setCurrReplied}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
        />
      )}
      {replies.map((reply) => (
        <CommentBox
          key={reply._id}
          threadId={threadId}
          comment={reply}
          currReplied={currReplied}
          setCurrReplied={setCurrReplied}
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
          nest={nest + 1}
          expand={expand}
          isClosed={isClosed}
          replyTo={_id}
        />
      ))}
    </div>
  );
}

export default CommentBox;
