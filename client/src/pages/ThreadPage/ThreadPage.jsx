import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
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
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currReplied, setCurrReplied] = useState(null);
  const [expandAll, setExpandAll] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [pendings, setPendings] = useState({
    thread: false,
    isClosed: false,
    changeTitle: false,
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && thread?.creator._id === user._id;

  // Scroll to the comment if it exists
  if (commentId) {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) commentElement.scrollIntoView({ behavior: "smooth" });
  }

  const fetchThread = async () => {
    setPendings({ ...pendings, thread: true });
    await axiosInstance
      .get(`/threads/${threadId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThread = res.data;
          setThread(fetchedThread);
          setCurrReplied(null);
          setNewTitle(fetchedThread.title);
        })
      )
      .catch((err) => handleError(err, null, () => setError("אירעה שגיאה בעת טעינת הדיון")))
      .finally(() => setPendings({ ...pendings, thread: false }));
  };

  // Initial fetch
  useEffect(() => {
    if (threadId) fetchThread();
  }, [threadId]);

  /**
   * Toggles the thread closed status.
   *
   * @async
   * @function toggleThreadClosed
   * @returns {Promise<void>} The result of toggling the thread closed status.
   */
  const toggleThreadClosed = async () => {
    if (pendings.isClosed) return;
    setPendings({ ...pendings, isClosed: true });
    await axiosInstance
      .put(`/threads/${threadId}`, { isClosed: !isClosed })
      .then((res) => handleResult(res, 200, () => setThread(res.data)))
      .catch((err) => handleError(err, "שגיאה בשינוי סטטוס הדיון"))
      .finally(() => setPendings({ ...pendings, isClosed: false }));

    setNewTitle(thread.title);
    setShowEditTitle(false);
  };

  // Update the isClosed state when the thread is fetched
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
      // Add a new comment
      await axiosInstance
        .post(`/threads/${threadId}/new-comment`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            toast.success("התגובה נוספה בהצלחה");
            setTimeout(() => window.location.reload(), 1000);
          })
        )
        .catch((err) => handleError(err, "הוספת התגובה נכשלה"))
        .finally(() => setIsPendingCallback(false));
    } else {
      // Reply to a comment
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

  /**
   * Changes the thread title.
   *
   * @async
   * @function changeThreadTitle
   * @returns {Promise<void>} The result of changing the thread title.
   */
  const changeThreadTitle = async () => {
    if (!newTitle) return toast.warning("אנא הכנס/י כותרת חדשה");

    if (isClosed) {
      toast.warning("הדיון נעול ולא ניתן לשנות את הכותרת");
      return;
    }

    if (newTitle === thread.title) {
      setShowEditTitle(false);
      return;
    }

    if (pendings.changeTitle) return;
    setPendings({ ...pendings, changeTitle: true });

    await axiosInstance
      .put(`/threads/${threadId}`, { title: newTitle })
      .then((res) =>
        handleResult(res, 200, () => {
          toast.success("הכותרת עודכנה בהצלחה");
          setTimeout(() => window.location.reload(), 1000);
        })
      )
      .catch((err) => handleError(err, "אירעה שגיאה בעת עדכון הכותרת"))
      .finally(() => setPendings({ ...pendings, changeTitle: false }));
  };

  return (
    <div className="thread-page">
      {pendings.thread && <div className="lds-dual-ring" id="thread-page-loading"></div>}
      {error && <div className="thread-page-error">{error}</div>}

      {!pendings.thread && !error && thread && (
        <div className="thread-page-content">
          <div className="thread-page-header">
            <div className="thread-page-star-toggle">
              <StarToggle threadId={threadId} />
            </div>

            {isClosed ? (
              <div className="thread-page-title">
                <span className="material-symbols-outlined">lock</span> {thread.title}
              </div>
            ) : (
              isAdmin &&
              (showEditTitle ? (
                <div className="thread-page-title">
                  <input
                    className="edit-title-input"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  {pendings.changeTitle ? (
                    <div className="lds-dual-ring" id="change-title-loading"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined edit-title-button" onClick={changeThreadTitle}>
                        check
                      </span>
                      <span
                        className="material-symbols-outlined edit-title-button"
                        onClick={() => setShowEditTitle(false)}
                      >
                        clear
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="thread-page-title">
                  {thread.title}
                  <span className="material-symbols-outlined edit-title-button" onClick={() => setShowEditTitle(true)}>
                    edit
                  </span>
                </div>
              ))
            )}

            <div className="thread-page-exam-details">{examToString(thread.exam)}</div>
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
                  {pendings.isClosed ? (
                    <div className="lds-dual-ring" id="isClosed-loading"></div>
                  ) : isClosed ? (
                    "פתח דיון"
                  ) : (
                    "נעל דיון"
                  )}
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
