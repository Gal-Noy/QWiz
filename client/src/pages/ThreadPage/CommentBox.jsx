import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDateAndTime } from "../../utils/generalUtils";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import defaultAvatar from "../../assets/default-avatar.jpg";
import NewComment from "./NewComment";
import ContentArea from "../../components/ContentArea/ContentArea";
import { toast } from "react-custom-alert";
import "./CommentBox.css";

/**
 * The comment box component.
 *
 * @component
 * @param {Object} props The component props.
 * @param {string} props.threadId The thread ID.
 * @param {Object} props.comment The comment object.
 * @param {string} props.currReplied The current replied comment ID.
 * @param {Function} props.setCurrReplied The function to set the current replied comment ID.
 * @param {Object} props.newComment The new comment object.
 * @param {Function} props.setNewComment The function to set the new comment object.
 * @param {Function} props.addComment The function to add a new comment.
 * @param {number} props.nest The comment nest level.
 * @param {boolean} props.expand The comment expand status.
 * @param {boolean} props.isClosed The thread closed status.
 * @param {string} props.replyTo The comment replied to ID.
 * @returns {JSX.Element} The rendered CommentBox component.
 */
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

  // Set the expand status
  useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  /**
   * Toggles the like status of the comment.
   *
   * @async
   * @function toggleLikeComment
   * @returns {Promise<void>} The result of toggling the like status.
   */
  const toggleLikeComment = async () => {
    if (likePending) return;
    setLikePending(true);
    await axiosInstance
      .put(`/threads/comment/${_id}`, {
        like: !isLiked,
      })
      .then((res) =>
        handleResult(res, 200, () => {
          setLikesCount(res.data.likes.length);
          setIsLiked(!isLiked);
        })
      )
      .catch((err) => handleError(err, "שגיאה בעדכון הלייק"))
      .finally(() => setLikePending(false));
  };

  /**
   * Allows to reply to the comment.
   *
   * @function allowReply
   * @returns {void} The result of allowing to reply to the comment.
   */
  const allowReply = () => {
    if (isClosed) {
      toast.warning("הדיון נעול ולא ניתן להוסיף תגובות");
      return;
    }

    setCurrReplied(_id);
  };

  // Edit mode states and functions
  const [editMode, setEditMode] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState(content);
  const [editedCommentTitle, setEditedCommentTitle] = useState(title);
  const [editPending, setEditPending] = useState(false);

  /**
   * Toggles the edit mode of the comment.
   *
   * @function toggleEditMode
   * @returns {void} The result of toggling the edit mode of the comment.
   */
  const toggleEditMode = () => {
    if (isClosed) {
      toast.warning("הדיון נעול ולא ניתן לערוך תגובות");
      return;
    }
    setEditMode(!editMode);
    setEditedCommentContent(content);
    setEditedCommentTitle(title);
  };
  /**
   * Updates the comment.
   *
   * @async
   * @function editComment
   * @returns {Promise<void>} The result of updating the comment.
   */
  const editComment = async () => {
    if (editedCommentContent === "") return toast.warning("אנא הכנס/י תוכן לתגובה");

    if (editedCommentTitle === title && editedCommentContent === content) return toggleEditMode();

    setEditPending(true);
    await axiosInstance
      .put(`/threads/comment/${_id}`, { title: editedCommentTitle, content: editedCommentContent })
      .then((res) =>
        handleResult(res, 200, () => {
          toast.success("התגובה עודכנה בהצלחה");
          setTimeout(() => window.location.reload(), 1000);
        })
      )
      .catch((err) => handleError(err, "אירעה שגיאה בעת עדכון התגובה"))
      .finally(() => setEditPending(false));
  };

  /**
   * Copies the comment link to the clipboard.
   *
   * @function copyLinkToClipboard
   * @returns {void} The result of copying the comment link to the clipboard.
   */
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
                </a>
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
                      <button className="comment-button" onClick={editComment}>
                        {editPending ? <div className="lds-dual-ring" id="edit-comment-loading"></div> : "שמור"}
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
      {/* Replies section */}
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
