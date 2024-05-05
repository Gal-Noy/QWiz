import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import SelectFilter from "../../components/SelectFilter/SelectFilter";
import MultiSelectFilter from "../../components/MultiSelectFilter/MultiSelectFilter";
import { toast } from "react-custom-alert";
import "./UploadForm.css";

/**
 * The upload form component.
 *
 * @component
 * @returns {JSX.Element} The rendered UploadForm component.
 */
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
    lecturers: [], // optional
    tags: [], // optional
    difficultyRating: 0, // optional, 1-5
  });
  const [isPending, setIsPending] = useState(false);
  const [selectLists, setSelectLists] = useState({
    faculties: [],
    departments: [],
    courses: [],
    tags: [],
    lecturers: [],
  });
  const [selectListsPendings, setSelectListsPendings] = useState({
    faculties: false,
    departments: false,
    courses: false,
    tags: false,
    lecturers: false,
  });

  /**
   * Handles the result of the API call.
   *
   * @async
   * @function createExam
   * @returns {Promise<void>} The result of the API call.
   */
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
      setIsPending(false);
      return toast.warning("יש למלא את כל השדות המסומנים בכוכבית.");
    }

    if (!file) {
      setIsPending(false);
      return toast.warning("יש להעלות קובץ.");
    }

    // Create the exam data object
    const examData = {
      ...examDetails,
      phone_number: studentDetails.phone_number,
      id_number: studentDetails.id_number,
    };

    // Create a form data object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("examData", JSON.stringify(examData));

    // Create the exam
    await axiosInstance
      .post("/exams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) =>
        handleResult(res, 201, () => {
          const { user: updatedUser, exam } = res.data;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          toast.success("המבחן נוצר בהצלחה!");
          setTimeout(() => (window.location.href = `/exam/${exam._id}`), 1000);
        })
      )
      .catch((err) => handleError(err))
      .finally(() => setIsPending(false));
  };

  /**
   * Clears the star rating.
   *
   * @function clearRating
   * @returns {void} The result of clearing the star rating.
   */
  const clearRating = () => {
    const stars = document.querySelectorAll(".radio-input");
    stars.forEach((star) => {
      star.checked = false;
    });
  };

  /**
   * Clears the form.
   *
   * @function clearForm
   * @returns {void} The result of clearing the form.
   */
  const clearForm = () => {
    const user = JSON.parse(localStorage.getItem("user"));

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
      lecturers: [],
      tags: [],
      difficultyRating: 0,
    });
    setSelectLists({
      ...selectLists,
      departments: [],
      courses: [],
      tags: [],
      lecturers: [],
    });
    cancelFile();
    clearRating();
  };

  /**
   * Fetches the faculties from the API.
   *
   * @async
   * @function fetchFaculties
   * @returns {Promise<void>} The result of fetching the faculties.
   */
  const fetchFaculties = async () => {
    if (selectListsPendings.faculties) return;
    setSelectListsPendings({ ...selectListsPendings, faculties: true });

    await axiosInstance
      .get(`/categories/faculties`)
      .then((res) => handleResult(res, 200, () => setSelectLists({ ...selectLists, faculties: res.data.data })))
      .catch((err) => handleError(err, "שגיאה בטעינת הפקולטות, אנא נסה שנית."))
      .finally(() => setSelectListsPendings({ ...selectListsPendings, faculties: false }));
  };

  /**
   * Fetches the departments by faculty from the API.
   *
   * @async
   * @function fetchDepartmentsByFaculty
   * @param {string} facultyId The faculty
   * @returns {Promise<void>} The result of fetching the departments.
   */
  const fetchDepartmentsByFaculty = async (facultyId) => {
    if (selectListsPendings.departments) return;
    setSelectListsPendings({ ...selectListsPendings, departments: true });

    await axiosInstance
      .get(`/categories/departments?faculty=${facultyId}`)
      .then((res) => handleResult(res, 200, () => setSelectLists({ ...selectLists, departments: res.data.data })))
      .catch((err) => handleError(err, "שגיאה בטעינת המחלקות, אנא נסה שנית."))
      .finally(() => setSelectListsPendings({ ...selectListsPendings, departments: false }));
  };

  /**
   * Fetches the courses by department from the API.
   *
   * @async
   * @function fetchCoursesByDepartment
   * @param {string} departmentId The department
   * @returns {Promise<void>} The result of fetching the courses.
   */
  const fetchCoursesByDepartment = async (departmentId) => {
    if (selectListsPendings.courses) return;
    setSelectListsPendings({ ...selectListsPendings, courses: true });

    await axiosInstance
      .get(`/categories/courses?department=${departmentId}`)
      .then((res) => handleResult(res, 200, () => setSelectLists({ ...selectLists, courses: res.data.data })))
      .catch((err) => handleError(err, "שגיאה בטעינת הקורסים, אנא נסה שנית."))
      .finally(() => setSelectListsPendings({ ...selectListsPendings, courses: false }));
  };

  /**
   * Fetches the course attributes from the API.
   *
   * @async
   * @function fetchCourseMetadata
   * @param {string} courseId The course
   * @returns {Promise<void>} The result of fetching the course attributes.
   */
  const fetchCourseMetadata = async (courseId) => {
    if (selectListsPendings.tags || selectListsPendings.lecturers) return;
    setSelectListsPendings({ ...selectListsPendings, tags: true, lecturers: true });

    await axiosInstance
      .get(`/categories/course/${courseId}/metadata`)
      .then((res) =>
        handleResult(res, 200, () => {
          const { tags, lecturers } = res.data;
          setSelectLists({ ...selectLists, tags, lecturers });
        })
      )
      .catch((err) => handleError(err, "שגיאה בטעינת התגיות והמרצים, אנא נסה שנית."))
      .finally(() => setSelectListsPendings({ ...selectListsPendings, tags: false, lecturers: false }));
  };

  // Initial fetch of faculties
  useEffect(() => {
    fetchFaculties();
  }, []);

  // Fetch departments and courses according to the chosen faculty
  useEffect(() => {
    setExamDetails({ ...examDetails, department: null, course: null });
    cancelFile();
    clearRating();
    if (examDetails.faculty) fetchDepartmentsByFaculty(examDetails.faculty._id);
  }, [examDetails.faculty]);

  useEffect(() => {
    setExamDetails({ ...examDetails, course: null });
    cancelFile();
    clearRating();
    if (examDetails.department) fetchCoursesByDepartment(examDetails.department._id);
  }, [examDetails.department]);

  // Fetch the course attributes by course
  useEffect(() => {
    setExamDetails({ ...examDetails, tags: [], lecturers: [] });
    cancelFile();
    clearRating();
    if (examDetails.course) fetchCourseMetadata(examDetails.course._id);
  }, [examDetails.course]);

  // File states and handlers
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  /**
   * Handles the file change event.
   *
   * @async
   * @function handleFileChange
   * @param {Object} e The event object
   * @returns {void} The result of handling the file change event.
   */
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.includes("pdf")) return toast.warning("נא להעלות קובץ מסוג PDF בלבד.");

      setFile(selectedFile);
    }
  };

  /**
   * Cancels the file upload.
   *
   * @function cancelFile
   * @returns {void} The result of canceling the file upload.
   */
  const cancelFile = () => {
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
    document.getElementById("upload-exam-file-input").value = null;
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
              <input className="upload-form-input" type="text" name="name" value={studentDetails.name} disabled />
            </div>
            <div className="upload-form-attr">
              <label>אימייל *</label>
              <input className="upload-form-input" type="email" name="email" value={studentDetails.email} disabled />
            </div>
            <div className="upload-form-attr">
              <label>טלפון *</label>
              <input
                className="upload-form-input"
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
                className="upload-form-input"
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
                options={selectLists.faculties}
                value={examDetails.faculty}
                setValue={(faculty) => setExamDetails({ ...examDetails, faculty })}
                placeholder="בחר פקולטה"
                dependency={true} // always enabled
                isPending={selectListsPendings.faculties}
              />
            </div>
            <div className="upload-form-attr">
              <label>מחלקה *</label>
              <SelectFilter
                options={selectLists.departments}
                value={examDetails.department}
                setValue={(department) => setExamDetails({ ...examDetails, department })}
                placeholder="בחר מחלקה"
                dependency={!!examDetails.faculty}
                isPending={selectListsPendings.departments}
              />
            </div>
            <div className="upload-form-attr">
              <label>שם קורס *</label>
              <SelectFilter
                options={selectLists.courses}
                value={examDetails.course}
                setValue={(course) => setExamDetails({ ...examDetails, course })}
                placeholder="בחר קורס"
                dependency={!!examDetails.department}
                isPending={selectListsPendings.courses}
              />
            </div>
            <div className="upload-form-attr">
              <label>מספר קורס *</label>
              <input
                className="upload-form-input"
                type="text"
                name="courseCode"
                value={examDetails.course ? examDetails.course.code : ""}
                disabled
              />
            </div>
            <div className="upload-form-attr">
              <label>שנה *</label>
              <input
                className="upload-form-input"
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
                <option value="3">ג'</option>
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
                className="upload-form-input"
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
              <label htmlFor="lecturers">מרצה/ים</label>
              <MultiSelectFilter
                placeholder="בחר / הוסף מרצים"
                options={selectLists.lecturers}
                setOptions={(lecturers) => setSelectLists({ ...selectLists, lecturers })}
                list={examDetails.lecturers}
                setList={(lecturers) => setExamDetails({ ...examDetails, lecturers })}
                dependency={!!examDetails.course}
                isPending={selectListsPendings.lecturers}
              />
            </div>
            <div className="upload-form-attr">
              <label>תגיות</label>
              <MultiSelectFilter
                placeholder="בחר / הוסף תגיות"
                options={selectLists.tags}
                setOptions={(tags) => setSelectLists({ ...selectLists, tags })}
                list={examDetails.tags}
                setList={(tags) => setExamDetails({ ...examDetails, tags })}
                dependency={!!examDetails.course}
                isPending={selectListsPendings.tags}
              />
            </div>
            <div className="upload-form-attr">
              <label>דירוג קושי</label>
              <form className="star-rating">
                {[5, 4, 3, 2, 1].map((star) => (
                  <React.Fragment key={star}>
                    <input className="radio-input" type="radio" id={`${star}-stars`} name="rating" value={star} />
                    <label
                      className={"radio-label"}
                      htmlFor={`${star}-stars`}
                      onClick={() => setExamDetails({ ...examDetails, difficultyRating: star })}
                    />
                  </React.Fragment>
                ))}
              </form>
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
