import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/VerifyOTP.css";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", { email, otp });
      alert(res.data.message);
      navigate("/set-password", { state: { email } });
    } catch (error) {
      alert("Invalid OTP!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100  verify-otp-container" style={{
      background: "linear-gradient(90deg, rgba(27,167,14,1) 0%, rgba(241,249,243,0.9831582291119573) 49%, rgba(27,167,14,1) 100%)", }}>
      <div className="card verify-otp-card shadow-lg p-4" style={{ width: "25rem" }}>
        <div className="card-body text-center">
          <h3 className="card-title verify-otp-title text-success mb-3">Verify OTP</h3>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input 
              type="text" 
              className="form-control verify-otp-input" 
              placeholder="Enter OTP" 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
            <button type="submit" className="btn verify-otp-btn btn-primary w-100">Verify OTP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;