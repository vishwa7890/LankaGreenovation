import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "../css/AdminLogin.css";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    }finally {
    setLoading(false); // Stop loading
  }
  };

  return (
    <>
      <AdminNavbar />
      {loading && (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
)}


      <div className="admin-login-bg">
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
