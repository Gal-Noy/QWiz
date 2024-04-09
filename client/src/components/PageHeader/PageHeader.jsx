import React from "react";
import "./PageHeader.css";

function PageHeader({ title, paragraphs }) {
  return (
    <div className="page-header">
      <label>{title}</label>
      {paragraphs?.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default PageHeader;
