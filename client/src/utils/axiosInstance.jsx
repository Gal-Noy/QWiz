import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers.authorization?.split(" ")[1];
    if (newToken && newToken !== localStorage.getItem("token")) {
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const handleResult = (res, status, callback) => {
  if (res.status === status) {
    if (callback) {
      callback();
    }
  } else {
    alert("תגובה לא צפויה מהשרת");
  }
};

export const handleError = (error, defaultMessage, callback) => {
  if (!error.response) {
    console.error(error.message);
    alert("שגיאת שרת");
    return;
  }

  const { status, data } = error.response;
  const { message, type } = data;

  console.error(status, data);

  if (status !== 401 && status !== 403 && defaultMessage) {
    alert(defaultMessage);
  } else {
    switch (status) {
      case 500: {
        alert("שגיאת שרת");
        break;
      }
      case 400: {
        switch (type) {
          case "MissingFieldsError": {
            alert("יש למלא את כל השדות");
            break;
          }
          case "UserExistError": {
            alert("משתמש כבר קיים עם אימייל זה");
            break;
          }
          case "PasswordLengthError": {
            alert("סיסמה חייבת להיות לפחות 6 תווים");
            break;
          }
          case "PasswordsMismatchError": {
            alert("הסיסמאות אינן תואמות");
            break;
          }
          case "UserActiveError": {
            alert("משתמש כבר מחובר");
            break;
          }
          case "InvalidCredentialsError": {
            alert("פרטי ההתחברות שגויים");
            break;
          }
          case "ExamExistsError": {
            alert("מבחן כבר קיים");
            break;
          }
          case "FileNotUploadedError": {
            alert("יש להעלות קובץ");
            break;
          }
          case "InvalidRatingError": {
            alert("דירוג לא חוקי");
            break;
          }
          case "EmailError": {
            alert("דואר אלקטרוני לא חוקי");
            break;
          }
          case "NameLengthError": {
            alert("שם חייב להיות לפחות 2 תווים");
            break;
          }
          case "PhoneNumberError": {
            alert("מספר טלפון לא חוקי");
            break;
          }
          case "PhoneNumberLengthError": {
            alert("מספר טלפון חייב להיות לפחות 9 ספרות");
            break;
          }
          case "IDNumberError": {
            alert("מספר תעודת זהות לא חוקי");
            break;
          }
          default: {
            alert("בקשה לא חוקית");
            break;
          }
        }
        break;
      }
      case 401: {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("תוקף ההתחברות פג, אנא התחבר מחדש");
        window.location.href = "/login";
        break;
      }
      case 403: {
        alert("אין לך הרשאה לבצע פעולה זו");
        break;
      }
      case 404: {
        switch (type) {
          case "UserNotFoundError": {
            alert("משתמש לא נמצא");
            break;
          }
          case "ExamNotFoundError": {
            alert("מבחן לא נמצא");
            break;
          }
          case "FacultyNotFoundError": {
            alert("פקולטה לא נמצאה");
            break;
          }
          case "DepartmentNotFoundError": {
            alert("מחלקה לא נמצאה");
            break;
          }
          case "CourseNotFoundError": {
            alert("קורס לא נמצא");
            break;
          }
          case "ThreadNotFoundError": {
            alert("דיון לא נמצא");
            break;
          }
          case "CommentNotFoundError": {
            alert("תגובה לא נמצאה");
            break;
          }
          default: {
            alert("לא נמצא");
            break;
          }
        }
        break;
      }
    }
  }

  if (callback) {
    callback();
  }
};

export default axiosInstance;
