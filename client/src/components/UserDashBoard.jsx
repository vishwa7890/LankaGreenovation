import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/dashboard", {
          withCredentials: true, // Send cookies with request
        });

        setUser(res.data.user);
        setMessage(res.data.message);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setMessage(err.response?.data?.message || "Failed to load dashboard.");
        navigate("/userlogin"); // Redirect to login if unauthorized
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", {}, { withCredentials: true });

      setUser(null); 
      navigate("/userlogin"); 
    } catch (err) {
      console.error("Logout failed:", err);
      setMessage("Logout failed");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      {user ? (
        <div>
          <h3>Welcome, {user.email}!</h3>
          <p>User ID: {user._id}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
