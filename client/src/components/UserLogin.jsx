import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/UserLogin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/user/login",
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Login successful!");
      navigate('/');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Login Error:", err.response);
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="loginPage">
        <div className="loginContainer">
          <h2 className="loginTitle">User Login</h2>
          <form className="loginForm" onSubmit={handleLogin}>
            <div className="inputGroup">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="inputGroup">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="loginBtn">Login</button>

            <p className="forgotPassword">
              <a href="/user/forgotpassword">Forgot Password?</a>
            </p>

            <p className="signupLink">
              Don't have an account? <a href="/user/register">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
