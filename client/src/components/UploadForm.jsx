import React, { useState } from "react";
import "../styles/UploadForm.css";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

function UploadForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [studentDetails, setStudentDetails] = useState({
    name: user.name,
    email: user.email,
    phone_number: user?.phone_number || "",
    id_number: user?.id_number || "",
  });
  const [examDetails, setExamDetails] = useState({
    faculty: "",
    department: "",
    course: { name: "", code: "" },
    year: "",
    semester: "",
    term: "",
    type: "",
    grade: "",
    lecturers: "",
    difficultyRating: "",
  });

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [fileS3Url, setFileS3Url] = useState("");

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.includes("pdf")) {
        alert("נא להעלות קובץ מסוג PDF בלבד.");
        return;
      }

      setFile(URL.createObjectURL(selectedFile));

      //   const formData = new FormData();
      //   formData.append("file", file);

      //   axios
      //     .post(`${import.meta.env.VITE_SERVER_URL}/exams`, formData)
      //     .then((res) => {
      //       if (res.status === 200) {
      //         setFileS3Url(res.data.Location);
      //         alert("הקובץ הועלה בהצלחה!");
      //       } else {
      //         alert("אירעה שגיאה בעת העלאת הקובץ. אנא נסה שנית.");
      //       }
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //       alert("אירעה שגיאה בעת העלאת הקובץ. אנא נסה שנית.");
      //     });
    }
  };

  const cancelFile = () => {
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
  };

  return (
    <div className="upload-form">
      <div className="upload-form-header">
        <label>טופס העלאת מבחן</label>
        <a>שים/י לב - שדות המסומנים בכוכבית (*) הן שדות חובה.</a>
      </div>
      <div className="upload-form-container">
        <div className="upload-form-content" id="upload-form-content-1">
          <label className="upload-form-content-header">פרטי הסטודנט</label>
          <form className="upload-form-details">
            <div className="upload-form-attr">
              <label>שם מלא *</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })}
                value={studentDetails.name}
                disabled
              />
            </div>
            <div className="upload-form-attr">
              <label>אימייל *</label>
              <input
                type="email"
                name="email"
                onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })}
                value={studentDetails.email}
                disabled
              />
            </div>
            <div className="upload-form-attr">
              <label>טלפון *</label>
              <input
                type="text"
                name="phone_number"
                onChange={(e) => setStudentDetails({ ...studentDetails, phone_number: e.target.value })}
                value={studentDetails.phone_number}
              />
            </div>
            <div className="upload-form-attr">
              <label>תעודת זהות *</label>
              <input
                type="text"
                name="id_number"
                onChange={(e) => setStudentDetails({ ...studentDetails, id_number: e.target.value })}
                value={studentDetails.id_number}
              />
            </div>
          </form>
        </div>
        <div className="upload-form-content" id="upload-form-content-2">
          <label className="upload-form-content-header">פרטי הבחינה</label>
          <div className="upload-form-details">
            <div className="upload-form-attr">
              <label>פקולטה *</label>
              <input
                type="text"
                name="text"
                onChange={(e) => setExamDetails({ ...examDetails, faculty: e.target.value })}
                value={examDetails.faculty}
              />
            </div>
            <div className="upload-form-attr">
              <label>מחלקה *</label>
              <input
                type="text"
                name="text"
                onChange={(e) => setExamDetails({ ...examDetails, department: e.target.value })}
                value={examDetails.department}
              />
            </div>
            <div className="upload-form-attr">
              <label>קורס *</label>
              <input
                type="text"
                name="text"
                onChange={(e) => setExamDetails({ ...examDetails, course: { name: e.target.value } })}
                value={examDetails.course.name}
              />
            </div>
            <div className="upload-form-attr">
              <label>מספר קורס *</label>
              <input
                type="text"
                name="text"
                onChange={(e) => setExamDetails({ ...examDetails, course: { code: e.target.value } })}
                value={examDetails.course.code}
              />
            </div>
            <div className="upload-form-attr">
              <label>שנה *</label>
              <input type="text" />
            </div>
            <div className="upload-form-attr">
              <label>סמסטר *</label>
              <input type="text" />
            </div>
            <div className="upload-form-attr">
              <label>מועד *</label>
              <input type="text" />
            </div>
            <div className="upload-form-attr">
              <label>סוג בחינה *</label>
              <input type="text" />
            </div>
            <div className="upload-form-attr">
              <label>ציון</label>
              <input type="text" />
            </div>
            <div className="upload-form-attr">
              <label>מרצה/ים</label>
              <input type="text" />
            </div>
          </div>
        </div>
        <div className="upload-form-content" id="upload-form-content-3">
          <label className="upload-form-content-header">קובץ המבחן</label>
          <input id="upload-exam-file-input" type="file" name="file" onChange={handleFileChange} />
          <div
            className={"upload-exam-btn" + (file ? " attached" : "")}
            onClick={() => {
              if (!file) document.getElementById("upload-exam-file-input").click();
            }}
          >
            העלאת קובץ
            {file && (
              <span className="material-symbols-outlined cancel-file" onClick={cancelFile}>
                cancel
              </span>
            )}
          </div>
          {file && (
            <div className="pdf-preview">
              {numPages > 1 && (
                <div className="pdf-preview-arrows">
                  <span
                    className={"material-symbols-outlined navigation-arrow" + (pageNumber < numPages ? " enabled" : "")}
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    arrow_forward_ios
                  </span>
                  <span
                    className={"material-symbols-outlined navigation-arrow" + (pageNumber > 1 ? " enabled" : "")}
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    arrow_back_ios
                  </span>
                </div>
              )}
              <Document file={file} onLoadSuccess={(file) => setNumPages(file?.numPages)}>
                <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
