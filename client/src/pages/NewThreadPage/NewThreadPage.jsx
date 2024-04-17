import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import ContentArea from "../../components/ContentArea/ContentArea";
import MultiSelectFilter from "../../components/MultiSelectFilter/MultiSelectFilter";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { examToStringVerbose } from "../../utils/generalUtils";
import { toast } from "react-custom-alert";
import "./NewThreadPage.css";

function NewThread() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [examPending, setExamPending] = useState(false);
  const [examData, setExamData] = useState("");
  const [threadDetails, setThreadDetails] = useState({
    title: "",
    exam: examId,
    tags: [],
  });
  const [threadContent, setThreadContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setExamPending(true);
    axiosInstance
      .get(`/exams/${examId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          setExam(res.data);
          setExamData(examToStringVerbose(res.data));
          setThreadDetails({ ...threadDetails, tags: res.data.tags });
        })
      )
      .catch((err) => handleError(err, "שגיאה בטעינת הבחינה, אנא נסה שנית."))
      .finally(() => setExamPending(false));
  }, [examId]);

  const createNewThread = async () => {
    if (!threadDetails.title || !threadContent) {
      toast.warning("אנא מלא/י כותרת ותוכן");
      return;
    }

    setIsPending(true);

    const newThread = {
      title: threadDetails.title,
      content: threadContent,
      exam: examId,
      tags: threadDetails.tags,
    };

    await axiosInstance
      .post("/threads", newThread)
      .then((res) =>
        handleResult(res, 201, () => {
          toast.success("הדיון נוצר בהצלחה");
          setTimeout(() => (window.location.href = `/thread/${res.data._id}`), 1000);
        })
      )
      .catch((err) => handleError(err, "יצירת הדיון נכשלה"))
      .finally(() => setIsPending(false));
  };

  const cancelNewThread = () => {
    window.location.href = `/exam/${examId}/forum`;
  };

  return (
    <div className="new-thread">
      <PageHeader title="הוסף דיון" />
      <div className="new-thread-container">
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="exam-id">
            פרטי הבחינה:
          </label>
          <input className="new-thread-input" type="text" id="exam-id" value={examData} disabled />
          {examPending && <div className="lds-dual-ring" id="new-thread-exam-loading"></div>}
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="title">
            כותרת:
          </label>
          <input
            className="new-thread-input"
            type="text"
            id="title"
            value={threadDetails.title}
            onChange={(e) => setThreadDetails({ ...threadDetails, title: e.target.value })}
          />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="content">
            תוכן:
          </label>
          <ContentArea content={threadContent} setContent={setThreadContent} />
        </div>
        <div className="new-thread-label-input-pair">
          <label className="new-thread-label" htmlFor="title">
            תגיות:
          </label>
          <MultiSelectFilter
            options={exam ? exam.tags : []}
            setOptions={(tags) => setExam({ ...exam, tags })}
            list={threadDetails.tags}
            setList={(tags) => setThreadDetails({ ...threadDetails, tags })}
            placeholder="בחר / הוסף תגיות"
            dependency={!!exam}
            isPending={examPending}
            newThreadPage={true}
          />
        </div>
        <div className="new-thread-buttons">
          <button className="new-thread-button" onClick={createNewThread}>
            {isPending ? <div className="lds-dual-ring" /> : "צור דיון"}
          </button>
          <button className="new-thread-button" onClick={cancelNewThread}>
            בטל
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewThread;
