import React from "react";
import "../styles/UploadForm.css";

function UploadForm() {
  return (
    <div className="upload-form">
      <div className="upload-form-header">טופס העלאת מבחן</div>
      <div className="upload-form-container">
        <div className="upload-form-content">
          <label className="upload-form-content-header">פרטי הסטודנט</label>
          <form className="student-details-form">
            <div className="student-detail-attr">
              <label>שם מלא</label>
              <input type="text" />
            </div>
            <div className="student-detail-attr">
              <label>אימייל</label>
              <input type="text" />
            </div>
            <div className="student-detail-attr">
              <label>טלפון</label>
              <input type="text" />
            </div>
            <div className="student-detail-attr">
              <label>תעודת זהות</label>
              <input type="text" />
            </div>
          </form>
        </div>
      </div>
      <form>
        <label>שם המבחן</label>
        <input type="text" />
        <label>קובץ המבחן</label>
        <input type="file" />
        <button>העלאה</button>
      </form>
    </div>
  );
}

export default UploadForm;
