import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../css/SetPassword.css"; // Your custom styles

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const calculateStrength = (pwd) => {
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]/.test(pwd)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Moderate";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password1) {
      toast.error("Passwords do not match.");
      return;
    }

    if (passwordStrength === "Very Weak" || passwordStrength === "Weak") {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/user/set-password", {
        email,
        password,
      });
      toast.success("Password set successfully!");
      navigate("/user/login");
    } catch (err) {
      toast.error("Error setting password!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 set-password-container"
      style={{
        background:
          "linear-gradient(90deg, rgba(27,167,14,1) 0%, rgba(241,249,243,0.983) 49%, rgba(27,167,14,1) 100%)",
      }}
    >
      <div className="card set-password-card shadow-lg p-4" style={{ width: "25rem" }}>
        <div className="card-body text-center">
          <h3 className="card-title set-password-title text-success mb-3">
            <i className="fas fa-key"></i> Set New Password
          </h3>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="input-group">
              <input
                type="password"
                className="form-control set-password-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  const pwd = e.target.value;
                  setPassword(pwd);
                  setPasswordStrength(calculateStrength(pwd));
                }}
                required
              />
            </div>
            {password && (
              <div className="text-start">
                <small>
                  Strength:{" "}
                  <span
                    style={{
                      color:
                        passwordStrength === "Very Weak"
                          ? "red"
                          : passwordStrength === "Weak"
                          ? "orange"
                          : passwordStrength === "Moderate"
                          ? "gold"
                          : passwordStrength === "Strong"
                          ? "green"
                          : "darkgreen",
                      fontWeight: "bold",
                    }}
                  >
                    {passwordStrength}
                  </span>
                </small>
              </div>
            )}
            <div className="input-group">
              <input
                type="password"
                className="form-control set-password-input"
                placeholder="Re-Enter the password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn set-password-btn btn-primary w-100"
              disabled={
                passwordStrength === "Very Weak" ||
                passwordStrength === "Weak" ||
                passwordStrength === ""
              }
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
