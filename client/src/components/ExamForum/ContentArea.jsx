import React from "react";
import "../../styles/ContentArea.css";

function ContentArea({ setContent }) {
  return (
    <div className="content-area">
      <div className="content-area-toolbar"></div>
      <div className="content-area-editor"></div>
    </div>
  );
}

export default ContentArea;
