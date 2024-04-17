import React from "react";
import "./PageHeader.css";

/**
 * A page header component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the page.
 * @param {Array} props.paragraphs - The paragraphs of the page.
 * @returns {JSX.Element} The rendered PageHeader component.
 */
function PageHeader(props) {
  const { title, paragraphs } = props;

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
