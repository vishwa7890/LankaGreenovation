import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UserRegister.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/user/forgot-password", {
        email,
      });
      toast.success(res.data.message || "OTP sent successfully!");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }finally {
    setLoading(false); // Stop spinner
  }
  };

  return (
    <>
      <Navbar />
      {loading && (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
)}
      <div className="signUpPage">
        <div className="signUpContainer">
          <h2 className="signupTitle">Forgot Password</h2>

          <form className="signupForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signupBtn">Send OTP</button>
            <p className="loginLink">
              Remembered your password? <a href="/user/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
