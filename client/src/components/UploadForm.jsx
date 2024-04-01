import React, { useState } from "react";
import "../styles/UploadForm.css";
import { Document, Page, pdfjs } from "react-pdf";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

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
  });
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.includes("pdf")) {
        alert("נא להעלות קובץ מסוג PDF בלבד.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const cancelFile = () => {
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
  };

  const createExam = async () => {
    console.log(studentDetails, examDetails, file);
    setIsPending(true);
    if (
      !studentDetails.name ||
      !studentDetails.email ||
      !studentDetails.phone_number ||
      !studentDetails.id_number ||
      !examDetails.faculty ||
      !examDetails.department ||
      !examDetails.course.name ||
      !examDetails.course.code ||
      !examDetails.year ||
      !examDetails.semester ||
      !examDetails.term ||
      !examDetails.type
    ) {
      alert("יש למלא את כל השדות המסומנים בכוכבית.");
      setIsPending(false);
      return;
    }

    if (!file) {
      alert("יש להעלות קובץ.");
      setIsPending(false);
      return;
    }

    const examData = {
      ...examDetails,
      phone_number: studentDetails.phone_number,
      id_number: studentDetails.id_number,
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examData", JSON.stringify(examData));

    await axiosInstance
      .post("/exams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert("המבחן נוסף בהצלחה!");
          navigate("/exams");
        } else {
          alert("אירעה שגיאה בעת הוספת המבחן. אנא נסה שנית.");
        }
      })
      .then(() => setIsPending(false))
      .catch((err) => {
        console.error(err);
        alert("אירעה שגיאה בעת הוספת המבחן. אנא נסה שנית.");
        setIsPending(false);
      });
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
                name="faculty"
                onChange={(e) => setExamDetails({ ...examDetails, faculty: e.target.value })}
                value={examDetails.faculty}
              />
            </div>
            <div className="upload-form-attr">
              <label>מחלקה *</label>
              <input
                type="text"
                name="department"
                onChange={(e) => setExamDetails({ ...examDetails, department: e.target.value })}
                value={examDetails.department}
              />
            </div>
            <div className="upload-form-attr">
              <label>קורס *</label>
              <input
                type="text"
                name="courseName"
                onChange={(e) =>
                  setExamDetails({
                    ...examDetails,
                    course: { ...examDetails.course, name: e.target.value },
                  })
                }
                value={examDetails.course.name}
              />
            </div>
            <div className="upload-form-attr">
              <label>מספר קורס *</label>
              <input
                type="text"
                name="courseCode"
                onChange={(e) =>
                  setExamDetails({
                    ...examDetails,
                    course: { ...examDetails.course, code: e.target.value },
                  })
                }
                value={examDetails.course.code}
              />
            </div>
            <div className="upload-form-attr">
              <label>שנה *</label>
              <input
                type="text"
                name="year"
                onChange={(e) => setExamDetails({ ...examDetails, year: e.target.value })}
                value={examDetails.year}
              />
            </div>
            <div className="upload-form-attr">
              <label>סמסטר *</label>
              <input
                type="text"
                name="semester"
                onChange={(e) => setExamDetails({ ...examDetails, semester: e.target.value })}
                value={examDetails.semester}
              />
            </div>
            <div className="upload-form-attr">
              <label>מועד *</label>
              <input
                type="text"
                name="term"
                onChange={(e) => setExamDetails({ ...examDetails, term: e.target.value })}
                value={examDetails.term}
              />
            </div>
            <div className="upload-form-attr">
              <label>סוג בחינה *</label>
              <input
                type="text"
                name="type"
                onChange={(e) => setExamDetails({ ...examDetails, type: e.target.value })}
                value={examDetails.type}
              />
            </div>
            <div className="upload-form-attr">
              <label>ציון</label>
              <input
                type="text"
                name="grade"
                onChange={(e) => setExamDetails({ ...examDetails, grade: e.target.value })}
                value={examDetails.grade}
              />
            </div>
            <div className="upload-form-attr">
              <label>מרצה/ים</label>
              <input
                type="text"
                name="lecturers"
                onChange={(e) => setExamDetails({ ...examDetails, lecturers: e.target.value })}
                value={examDetails.lecturers}
              />
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
                    onClick={() => {
                      if (pageNumber < numPages) setPageNumber(pageNumber + 1);
                    }}
                  >
                    arrow_forward_ios
                  </span>
                  {numPages} / {numPages}
                  <span
                    className={"material-symbols-outlined navigation-arrow" + (pageNumber > 1 ? " enabled" : "")}
                    onClick={() => {
                      if (pageNumber > 1) setPageNumber(pageNumber - 1);
                    }}
                  >
                    arrow_back_ios
                  </span>
                </div>
              )}
              <Document file={URL.createObjectURL(file)} onLoadSuccess={(file) => setNumPages(file?.numPages)}>
                <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>
          )}
          {file && (
            <div className="upload-exam-btn" onClick={createExam}>
              {isPending ? <div className="lds-dual-ring"></div> : "יצירת מבחן"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
