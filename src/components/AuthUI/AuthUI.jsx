import React, { useState } from "react";
import "./AuthUI.css"; // Importing the CSS file

export default function AuthUI( { onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    username: formData.username,
    password: formData.password,
  };

  // add confirm_password only for register
  if (!isLogin) {
    payload.confirm_password = formData.confirmPassword;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // REGISTER SUCCESS
    if (!isLogin && response.status === 201) {
      alert(data.message);
      setIsLogin(true); // switch to login
      return;
    }

    // LOGIN SUCCESS
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userId", data.user_id);

      onLogin(); // ✅ now user is authenticated
    } else {
      alert(data.error || "Authentication failed");
    }
  } catch (error) {
    console.error("Auth error:", error);
    alert("Server error");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>
          )}

         // Inside AuthUI component
<button type="submit" className="auth-button">
  {isLogin ? "Login" : "Register"}
</button>

        </form>

        <p className="toggle-text">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
