import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UserRegister.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Simple regex for email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Indian phone number check (10 digits only)
  const isValidPhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !phone) {
      toast.error("All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Invalid phone number! It should be 10 digits.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        username,
        email,
        phone,
      });

      toast.success(res.data.message);
      navigate("/verify-otp", { state: { email: email } });
    } catch (error) {
      const errMsg = error.response?.data?.message;
      if (errMsg?.includes("exists") || errMsg?.includes("already")) {
        toast.error("User already exists with this email");
      } else {
        toast.error(errMsg || "Registration failed!");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="signUpPage">
        <div className="signUpContainer">
          <h2 className="signupTitle">User Registration</h2>

          <form className="signupForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="text"
                name="username"
                placeholder="Name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="inputGroup">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="inputGroup">
              <FontAwesomeIcon icon={faPhone} className="icon" />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signupBtn">Register</button>

            <p className="loginLink">
              Already have an account? <a href="/user/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
