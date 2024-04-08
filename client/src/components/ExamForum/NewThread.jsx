import React from "react";
import { useParams } from "react-router-dom";
import "../../styles/NewThread.css";

function NewThread() {
  const { examId } = useParams();
  return (
    <div>
      <h1>New Thread</h1>
    </div>
  );
}

export default NewThread;
