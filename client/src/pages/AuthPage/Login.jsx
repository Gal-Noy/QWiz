import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { toast } from "react-custom-alert";

/**
 * The login component.
 *
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);

  /**
   * Handle the login event.
   *
   * @async
   * @function
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const { email, password } = loginData;

    if (!email || !password) {
      setIsPending(false);
      return toast.warning("יש למלא כל השדות");
    }

    // Clear the local storage before logging in
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    await axiosInstance
      .post("/auth/login", loginData)
      .then((res) =>
        handleResult(res, 200, () => {
          // Save the token and user data in the local storage, then redirect to the home page
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.location.href = "/home";
        })
      )
      .catch((err) => handleError(err, null, () => setIsPending(false)));
  };

  return (
    <div className="auth-container">
      <h1>התחברות</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        />
        <button type="submit" className="auth-submit-button">
          {isPending ? <div className="lds-dual-ring" id="auth-loading"></div> : "התחבר/י"}
        </button>
      </form>
      <span className="auth-form-footer">
        עוד לא נרשמת? הירשם/י&nbsp;
        <Link to="/auth/register">כאן</Link>
      </span>
    </div>
  );
}

export default Login;
