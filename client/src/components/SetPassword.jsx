import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/SetPassword.css"; // Optional custom CSS

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password1) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/user/set-password", { email, password });
      alert("Password set successfully!");
      navigate("/user/login");
    } catch (err) {
      setError("Error setting password!");
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

          {/* Show error message if any */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="input-group">
              <input
                type="password"
                className="form-control set-password-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
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
            <button type="submit" className="btn set-password-btn btn-primary w-100">
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
