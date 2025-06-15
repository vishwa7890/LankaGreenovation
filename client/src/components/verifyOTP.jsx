import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/VerifyOTP.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/user/register");
  }, [email, navigate]);

  // Start resend timer
  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  // Auto-submit when 6 digits filled
  useEffect(() => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      handleSubmit(fullOtp);
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pasted)) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (fullOtp) => {
    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", {
        email,
        otp: fullOtp,
      });
      toast.success(res.data.message || "OTP Verified!");
      navigate("/set-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/user/resend-otp", { email });
      toast.success(res.data.message || "OTP resent successfully");
      setTimer(60);
      setResendDisabled(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 verify-otp-container"
      style={{
        background:
          "linear-gradient(90deg, rgba(27,167,14,1) 0%, rgba(241,249,243,0.983) 49%, rgba(27,167,14,1) 100%)",
      }}
    >
      <div className="card verify-otp-card shadow-lg p-4" style={{ width: "25rem" }}>
        <div className="card-body text-center">
          <h3 className="card-title verify-otp-title text-success mb-3">Verify OTP</h3>

          <div className="d-flex justify-content-center gap-2 mb-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className="form-control text-center"
                style={{ width: "40px", fontSize: "20px" }}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                required
              />
            ))}
          </div>

          <div className="mt-2">
            <button
              className="btn btn-link"
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
