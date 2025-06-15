import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "../css/AdminLogin.css";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/login",
        { username, password },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Login successful!");
      window.location.href = "/admindashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div
        style={{
          minHeight: "100vh",
          padding: "50px",
          background:
            "linear-gradient(90deg, rgba(27,167,14,1) 0%, rgba(241,249,243,0.9831582291119573) 49%, rgba(27,167,14,1) 100%)",
        }}
      >
        <div className="admin-login-container fade-in">
          <h2 className="admin-login-title">Admin Login</h2>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                className="admin-input"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                className="admin-input"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin-login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
