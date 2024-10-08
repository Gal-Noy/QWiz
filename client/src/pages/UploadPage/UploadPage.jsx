import React from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import UploadForm from "./UploadForm";
import "./UploadPage.css";

/**
 * The upload page component.
 *
 * @component
 * @returns {JSX.Element} The rendered UploadPage component.
 */
function UploadPage() {
  const paragraphs = [
    "אנא וודאו שהמבחן שאתם מעלים נכון ומלא כדי להבטיח את איכות המאגר.",
    "בנוסף, יש להקפיד על סריקה ברורה של המבחן לפני ההעלאה.",
  ];

  return (
    <div className="upload-page">
      <PageHeader title={"העלאת בחינה למאגר המבחנים"} paragraphs={paragraphs} />
      <div className="useful-links-div">
        <label className="useful-links-header">כלים שימושיים</label>
        <div className="useful-links-buttons">
          <a className="useful-link-btn" href="https://www.ilovepdf.com/merge_pdf" target="_blank" rel="noreferrer">
            איחוד קבצי PDF
          </a>
          <a
            className="useful-link-btn"
            href="https://www.freepdfconvert.com/he/compress-pdf"
            target="_blank"
            rel="noreferrer"
          >
            דחיסת קובץ PDF
          </a>
        </div>
      </div>
      <UploadForm />
    </div>
  );
}

export default UploadPage;
