import axios from "axios";
import { toast } from "react-custom-alert";

// Create an axios instance with the server URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Adds the token to the headers if it exists in the local storage
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

// Checks if there is a new token in the response headers and updates the local storage with the new token
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

// Handles the response from the server according to the status code
export const handleResult = (res, status, callback) => {
  if (res.status === status) {
    if (callback) {
      callback();
    }
  } else {
    toast.error("תגובה לא צפויה מהשרת");
  }
};

// Handles the error response from the server according to the status code and the error type
export const handleError = (error, defaultMessage, callback) => {
  if (!error.response) {
    console.error(error.message);
    return toast.error("שגיאת שרת");
  }

  const { status, data } = error.response;
  const { message, type } = data;

  console.error(status, data);

  if (status !== 401 && status !== 403 && defaultMessage) {
    toast.error(defaultMessage);
  } else {
    switch (status) {
      case 500: {
        toast.error("שגיאת שרת");
        break;
      }
      case 400: {
        switch (type) {
          case "MissingFieldsError": {
            toast.error("יש למלא את כל השדות");
            break;
          }
          case "UserExistError": {
            toast.error("משתמש כבר קיים עם אימייל זה");
            break;
          }
          case "PasswordLengthError": {
            toast.error("סיסמה חייבת להיות לפחות 6 תווים");
            break;
          }
          case "PasswordsMismatchError": {
            toast.error("הסיסמאות אינן תואמות");
            break;
          }
          case "UserActiveError": {
            toast.error("משתמש כבר מחובר");
            break;
          }
          case "InvalidCredentialsError": {
            toast.error("פרטי ההתחברות שגויים");
            break;
          }
          case "ExamExistsError": {
            toast.error("הבחינה כבר קיימת עם ציון גבוה יותר");
            break;
          }
          case "FileNotUploadedError": {
            toast.error("יש להעלות קובץ");
            break;
          }
          case "InvalidRatingError": {
            toast.error("דירוג לא חוקי");
            break;
          }
          case "EmailError": {
            toast.error("דואר אלקטרוני לא חוקי");
            break;
          }
          case "NameLengthError": {
            toast.error("שם חייב להיות לפחות 2 תווים");
            break;
          }
          case "PhoneNumberError": {
            toast.error("מספר טלפון לא חוקי");
            break;
          }
          case "PhoneNumberLengthError": {
            toast.error("מספר טלפון חייב להיות לפחות 9 ספרות");
            break;
          }
          case "IDNumberError": {
            toast.error("מספר תעודת זהות לא חוקי");
            break;
          }
          case "InvalidIDError": {
            toast.error("מזהה לא חוקי");
            break;
          }
          case "InvalidGradeError": {
            toast.error("ציון הבחינה חייב להיות בין 0 ל-100");
            break;
          }
          case "InvalidYearError": {
            toast.error("שנת הבחינה חייבת להיות בין 2000 ל-2024");
            break;
          }
          case "LecturerInvalidError": {
            toast.error("שם המרצה חייב להיות בין 2 ל-100 תווים");
            break;
          }
          case "TagInvalidError": {
            toast.error("תגית חייבת להיות בין 2 ל-20 תווים");
            break;
          }
          case "TitleInvalidError": {
            toast.error("על הכותרת להיות בין 2 ל-100 תווים");
            break;
          }
          case "ContentInvalidError": {
            toast.error("תוכן לא יכול להיות ריק");
            break;
          }
          default: {
            toast.error("בקשה לא חוקית");
            break;
          }
        }
        break;
      }
      case 401: {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("תוקף ההתחברות פג, אנא התחבר מחדש");
        setTimeout(() => (window.location.href = "/auth/login"), 1000);
        break;
      }
      case 403: {
        toast.error("אין לך הרשאה לבצע פעולה זו");
        break;
      }
      case 404: {
        switch (type) {
          case "UserNotFoundError": {
            toast.error("משתמש לא נמצא");
            break;
          }
          case "ExamNotFoundError": {
            toast.error("בחינה לא נמצאה");
            break;
          }
          case "FacultyNotFoundError": {
            toast.error("פקולטה לא נמצאה");
            break;
          }
          case "DepartmentNotFoundError": {
            toast.error("מחלקה לא נמצאה");
            break;
          }
          case "CourseNotFoundError": {
            toast.error("קורס לא נמצא");
            break;
          }
          case "ThreadNotFoundError": {
            toast.error("דיון לא נמצא");
            break;
          }
          case "CommentNotFoundError": {
            toast.error("תגובה לא נמצאה");
            break;
          }
          default: {
            toast.error("לא נמצא");
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
