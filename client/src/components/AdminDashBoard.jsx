import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "../css/AdminDashboard.css"; // ⬅️ Make sure to import the CSS

const AdminDashBoard = () => {
  const [admin, setAdmin] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/dashboard", {
          withCredentials: true,
        });

        setAdmin(res.data.admin);
        setMessage(res.data.message);
        setShowPopup(true);

        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } catch (err) {
        setMessage(err.response?.data?.message || "Unauthorized");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <AdminNavbar />

      {showPopup && (
        <div className="popup-message success">
          👋 Welcome back, {admin?.username || "Admin"}!
        </div>
      )}

      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        {admin ? (
          <div>
            <p>{message}</p>
            <p>Username: {admin.username}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashBoard;
