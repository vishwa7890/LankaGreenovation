import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios
import "../css/AdminNavbar.css";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Clear any localStorage if used
      // localStorage.removeItem('adminToken');

      const response = await axios.post(
        "http://localhost:5000/admin/logout",
        {},
        { withCredentials: true } // To send cookies if auth uses them
      );

      toast.success("Logout Success:", response.data.message || "Logged out");

      // Redirect to login page
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout Failed:", err.response?.data?.message || err.message);
     toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo with brand name */}
        <Link className="custom-navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Logo.jpg"
            alt="Lanka Greenovation Logo"
            className="custom-navbar-logo"
          />
          <span className="fw-bold custom-navbar-text">Lanka Greenovation</span>
        </Link>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/AddProduct">Add Product</Link>
            </li>
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/ProductList">Edit Product</Link>
            </li>
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/admin/contact">View Messages</Link>
            </li>
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/admin/orders">View Orders</Link>
            </li>
            <li className="nav-item">
              {/* Logout Button */}
              <button className="btn custom-nav-btn" onClick={handleLogout}>
                LogOut
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
