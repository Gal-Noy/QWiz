export const handleError = (error, callback) => {
  if (error.response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("תוקף ההתחברות פג, אנא התחבר מחדש");
    window.location.href = "/login";
  } else {
    if (callback) {
      callback();
    }
  }
};
