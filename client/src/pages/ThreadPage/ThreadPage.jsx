import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import CommentBox from "./CommentBox";
import NewComment from "./NewComment";
import StarToggle from "../../components/StarToggle/StarToggle";
import { examToString, mapTags, sumComments } from "../../utils/generalUtils";
import { toast } from "react-custom-alert";
import "./ThreadPage.css";

/**
 * The thread page component.
 *
 * @component
 * @returns {JSX.Element} The rendered ThreadPage component.
 */
function ThreadPage() {
  const { threadId, commentId } = useParams();
  const [thread, setThread] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currReplied, setCurrReplied] = useState(null);
  const [expandAll, setExpandAll] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isClosedPending, setIsClosedPending] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && thread?.creator._id === user._id;

  if (commentId) {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) commentElement.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!threadId) return;

    setIsPending(true);

    axiosInstance
      .get(`/threads/${threadId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThread = res.data;
          setThread(fetchedThread);
          setCurrReplied(null);
        })
      )
      .catch((err) => handleError(err, null, () => setError("אירעה שגיאה בעת טעינת הדיון")))
      .finally(() => setIsPending(false));
  }, [threadId]);

  /**
   * Toggles the thread closed status.
   *
   * @async
   * @function toggleThreadClosed
   * @returns {Promise<void>} The result of toggling the thread closed status.
   */
  const toggleThreadClosed = async () => {
    if (isClosedPending) return;
    setIsClosedPending(true);
    await axiosInstance
      .post(`/threads/${threadId}/toggle`)
      .then((res) => handleResult(res, 200, () => setThread(res.data)))
      .catch((err) => handleError(err, "שגיאה בשינוי סטטוס הדיון"))
      .finally(() => setIsClosedPending(false));
  };

  useEffect(() => {
    if (thread) setIsClosed(thread.isClosed);
  }, [thread]);

  /**
   * Adds a comment to the thread.
   *
   * @async
   * @function addComment
   * @param {Function} setIsPendingCallback The setIsPending function.
   * @returns {Promise<void>} The result of adding the comment.
   */
  const addComment = async (setIsPendingCallback) => {
    if (isClosed) {
      toast.warning("הדיון נעול ולא ניתן להוסיף תגובות");
      return;
    }

    if (!newComment) {
      toast.warning("אנא הכנס/י תוכן לתגובה");
      return;
    }

    setIsPendingCallback(true);

    if (!currReplied) {
      await axiosInstance
        .post(`/threads/${threadId}/comment`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            toast.success("התגובה נוספה בהצלחה");
            setTimeout(() => window.location.reload(), 1000);
          })
        )
        .catch((err) => handleError(err, "הוספת התגובה נכשלה"))
        .finally(() => setIsPendingCallback(false));
    } else {
      await axiosInstance
        .post(`/threads/${threadId}/comment/${currReplied}/reply`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            toast.success("התגובה נוספה בהצלחה");
            setTimeout(() => window.location.reload(), 1000);
          })
        )
        .catch((err) => handleError(err, "הוספת התגובה נכשלה"))
        .finally(() => setIsPendingCallback(false));
    }
  };

  return (
    <div className="thread-page">
      {isPending && <div className="lds-dual-ring" id="thread-page-loading"></div>}
      {error && <div className="thread-page-error">{error}</div>}

      {!isPending && !error && thread && (
        <div className="thread-page-content">
          <div className="thread-page-header">
            <div className="thread-page-star-toggle">
              <StarToggle threadId={threadId} />
            </div>
            <div className="thread-page-exam-details">
              {isClosed ? <span className="material-symbols-outlined">lock</span> : ""}
              {examToString(thread.exam)}
            </div>
            <div className="thread-page-views-and-comments">
              <div className="thread-page-views">
                {thread.views} <span className="material-symbols-outlined">visibility</span>
              </div>
              <div className="thread-page-comments">
                {sumComments(thread.comments)} <span className="material-symbols-outlined">chat_bubble_outline</span>
              </div>
            </div>
            <button className="go-to-exam-button" onClick={() => (window.location.href = `/exam/${thread.exam._id}`)}>
              לעמוד המבחן
            </button>
            <div className="thread-page-tags">{mapTags(thread.tags)}</div>
            <div className="thread-header-bottom-buttons">
              <button className="thread-header-bottom-button" onClick={() => setExpandAll(!expandAll)}>
                {expandAll ? "כווץ הכל" : "הרחב הכל"}
              </button>
              {isAdmin && (
                <button className="thread-header-bottom-button" onClick={toggleThreadClosed}>
                  {isClosedPending && <div className="lds-dual-ring" id="isClosed-loading"></div>}
                  {!isClosedPending && (isClosed ? "פתח דיון" : "נעל דיון")}
                </button>
              )}
            </div>
          </div>

          <div className="thread-comment-list">
            {thread.comments.map((comment) => (
              <CommentBox
                key={comment._id}
                threadId={threadId}
                comment={comment}
                currReplied={currReplied}
                setCurrReplied={setCurrReplied}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
                nest={0}
                expand={expandAll}
                isClosed={isClosed}
                replyTo={thread.comments[0]._id} // reply to the first comment
              />
            ))}

            {!isClosed && !currReplied && (
              <NewComment
                currReplied={null}
                setCurrReplied={setCurrReplied}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadPage;
