import React, { useState, useEffect } from "react";
import "../../styles/UploadForm.css";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import SelectFilter from "./SelectFilter";

function UploadForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [studentDetails, setStudentDetails] = useState({
    name: user.name,
    email: user.email,
    phone_number: user?.phone_number || "",
    id_number: user?.id_number || "",
  });
  const [examDetails, setExamDetails] = useState({
    faculty: null,
    department: null,
    course: null,
    year: 2024, // 2000-2100
    semester: 1, // 1, 2, 3
    term: 1, // 1, 2, 3
    type: "test", // quiz or test
    grade: 85, // optional, 0-100
    lecturers: "", // optional
  });
  const createExam = async () => {
    setIsPending(true);
    if (
      !studentDetails.name ||
      !studentDetails.email ||
      !studentDetails.phone_number ||
      !studentDetails.id_number ||
      !examDetails.faculty ||
      !examDetails.department ||
      !examDetails.course ||
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

    await axios
      .post(`${import.meta.env.VITE_SERVER_URL}/exams`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          const updatedUser = res.data.user;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          var stayOnPage = window.confirm("המבחן נוסף בהצלחה! האם תרצה להוסיף עוד מבחן?");
          if (!stayOnPage) {
            navigate("/");
          }
          clearForm();
        }
      })
      .then(() => setIsPending(false))
      .catch((err) =>
        handleError(err, () => {
          alert(err.response.data.message);
          setIsPending(false);
        })
      );
  };

  const clearForm = () => {
    setStudentDetails({
      name: user.name,
      email: user.email,
      phone_number: user?.phone_number || "",
      id_number: user?.id_number || "",
    });
    setExamDetails({
      faculty: null,
      department: null,
      course: null,
      year: 2024,
      semester: 1,
      term: 1,
      type: "test",
      grade: 85,
      lecturers: "",
    });
    setFaculties([]);
    setDepartments([]);
    setCourses([]);
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
  };

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchFaculties = async () =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculties`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const sortedFaculties = res.data.sort((a, b) => (a.name > b.name ? 1 : -1));
        setFaculties(sortedFaculties);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  const fetchDepartmentsByFaculty = async (facultyId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/faculty/${facultyId}/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const sortedDepartments = res.data.sort((a, b) => (a.name > b.name ? 1 : -1));
        setDepartments(sortedDepartments);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  const fetchCoursesByDepartment = async (departmentId) =>
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/info/department/${departmentId}/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const sortedCourses = res.data.sort((a, b) => (a.name > b.name ? 1 : -1));
        setCourses(sortedCourses);
      })
      .catch((err) => handleError(err, () => console.log(err.response.data.message)));

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    setExamDetails({ ...examDetails, department: null, course: null });
    if (examDetails.faculty) fetchDepartmentsByFaculty(examDetails.faculty._id);
  }, [examDetails.faculty]);

  useEffect(() => {
    setExamDetails({ ...examDetails, course: null });
    if (examDetails.department) fetchCoursesByDepartment(examDetails.department._id);
  }, [examDetails.department]);

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

  return (
    <div className="upload-form">
      <div className="upload-form-header">
        <label>טופס העלאת מבחן</label>
        <a>שים/י לב - שדות המסומנים בכוכבית (*) הן שדות חובה.</a>
      </div>
      <div className="upload-form-container">
        <div className="upload-form-content" id="upload-form-content-1">
          <span className="material-symbols-outlined upload-form-clear-btn" onClick={clearForm}>
            delete
          </span>
          <label className="upload-form-content-header">פרטי הסטודנט</label>
          <form className="upload-form-details">
            <div className="upload-form-attr">
              <label>שם מלא *</label>
              <input type="text" name="name" value={studentDetails.name} disabled />
            </div>
            <div className="upload-form-attr">
              <label>אימייל *</label>
              <input type="email" name="email" value={studentDetails.email} disabled />
            </div>
            <div className="upload-form-attr">
              <label>טלפון *</label>
              <input
                type="text"
                name="phone_number"
                onChange={(e) => setStudentDetails({ ...studentDetails, phone_number: e.target.value })}
                value={studentDetails.phone_number}
                {...(user.phone_number ? { disabled: true } : {})}
              />
            </div>
            <div className="upload-form-attr">
              <label>תעודת זהות *</label>
              <input
                type="text"
                name="id_number"
                onChange={(e) => setStudentDetails({ ...studentDetails, id_number: e.target.value })}
                value={studentDetails.id_number}
                {...(user.id_number ? { disabled: true } : {})}
              />
            </div>
          </form>
        </div>
        <div className="upload-form-content" id="upload-form-content-2">
          <label className="upload-form-content-header">פרטי הבחינה</label>
          <div className="upload-form-details">
            <div className="upload-form-attr">
              <label>פקולטה *</label>
              <SelectFilter
                options={faculties.map((faculty) => ({ name: faculty.name, value: faculty }))}
                onChange={(faculty) => setExamDetails({ ...examDetails, faculty, department: null, course: null })}
                placeholder="בחר פקולטה"
                dependency={true} // always enabled
              />
            </div>
            <div className="upload-form-attr">
              <label>מחלקה *</label>
              <SelectFilter
                options={departments.map((department) => ({ name: department.name, value: department }))}
                onChange={(department) => setExamDetails({ ...examDetails, department, course: null })}
                placeholder="בחר מחלקה"
                dependency={examDetails.faculty}
              />
            </div>
            <div className="upload-form-attr">
              <label>שם קורס *</label>
              <SelectFilter
                options={courses.map((course) => ({ name: course.name, value: course }))}
                onChange={(course) => setExamDetails({ ...examDetails, course })}
                placeholder="בחר קורס"
                dependency={examDetails.department}
              />
            </div>
            <div className="upload-form-attr">
              <label>מספר קורס *</label>
              <input type="text" name="courseCode" value={examDetails.course ? examDetails.course.code : ""} disabled />
            </div>
            <div className="upload-form-attr">
              <label>שנה *</label>
              <input
                type="number"
                name="year"
                onChange={(e) => setExamDetails({ ...examDetails, year: e.target.value })}
                value={examDetails.year}
                {...(!examDetails.course ? { disabled: true } : {})}
              />
            </div>
            <div className="upload-form-attr">
              <label>סמסטר *</label>
              <select
                onChange={(e) => setExamDetails({ ...examDetails, semester: e.target.value })}
                disabled={!examDetails.course}
              >
                <option value="1">א'</option>
                <option value="2">ב'</option>
                <option value="3">קיץ</option>
              </select>
            </div>
            <div className="upload-form-attr">
              <label>מועד *</label>
              <select
                onChange={(e) => setExamDetails({ ...examDetails, term: e.target.value })}
                disabled={!examDetails.course}
              >
                <option value="1">א'</option>
                <option value="2">ב'</option>
                <option value="3">מיוחד</option>
              </select>
            </div>
            <div className="upload-form-attr">
              <label>סוג בחינה *</label>
              <select
                onChange={(e) => setExamDetails({ ...examDetails, type: e.target.value })}
                disabled={!examDetails.course}
              >
                <option value="test">מבחן</option>
                <option value="quiz">בוחן</option>
              </select>
            </div>
            <div className="upload-form-attr">
              <label>ציון</label>
              <input
                type="number"
                name="grade"
                min={0}
                max={100}
                onChange={(e) => setExamDetails({ ...examDetails, grade: e.target.value })}
                value={examDetails.grade}
                {...(!examDetails.course ? { disabled: true } : {})}
              />
            </div>
            <div className="upload-form-attr">
              <label>מרצה/ים</label>
              <input
                type="text"
                name="lecturers"
                onChange={(e) => setExamDetails({ ...examDetails, lecturers: e.target.value })}
                value={examDetails.lecturers}
                {...(!examDetails.course ? { disabled: true } : {})}
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
            <div id="pdf-preview">
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
                  {numPages} / {pageNumber}
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
