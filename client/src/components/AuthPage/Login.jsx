import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const { email, password } = loginData;

    if (!email || !password) {
      alert("יש למלא כל השדות");
      setIsPending(false);
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, loginData)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          onLogin();
          navigate("/");
        } else {
          alert("אימייל או סיסמה שגויים");
        }
      })
      .then(() => setIsPending(false))
      .catch((err) => {
        alert(err.response.data.msg);
        setIsPending(false);
      });
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
          {isPending ? <div className="lds-dual-ring"></div> : "התחבר/י"}
        </button>
      </form>
      <span className="auth-form-footer">
        עוד לא נרשמת? הירשם/י&nbsp;
        <Link to="/register">כאן</Link>
      </span>
    </div>
  );
}

export default Login;
