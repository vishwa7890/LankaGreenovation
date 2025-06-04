import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UserRegister.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

const UserRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        username,
        email,
        phone,
      });
      alert(res.data.message);
      navigate("/verify-otp", { state: { email: email } });
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="signUpPage"> {/* Same class as SignUp */}
        <div className="signUpContainer"> {/* Same class as SignUp */}
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
