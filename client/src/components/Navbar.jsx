import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ← manage toggle
const navigate = useNavigate();

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="custom-navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Logo.jpg"
            alt="Lanka Greenovation Logo"
            className="custom-navbar-logo"
          />
          <span className="fw-bold custom-navbar-text">Lanka Greenovation</span>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/user/productlist" onClick={() => setMenuOpen(false)}>Products</Link>
            </li>

            {/* More Dropdown */}
            <li className="nav-item dropdown more-dropdown">
              <button
                className="btn custom-nav-btn"
                onClick={() => setMoreDropdown(!moreDropdown)}
              >
                More ▾
              </button>
              {moreDropdown && (
                <div className="more-dropdown-menu">
                  <Link className="dropdown-item" to="/user/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                  <Link className="dropdown-item" to="/user/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
                  <Link className="dropdown-item" to="/Gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
                  <Link className="dropdown-item" to="/aboutus" onClick={() => setMenuOpen(false)}>About</Link>
                  <Link className="dropdown-item" to="/ContactUs" onClick={() => setMenuOpen(false)}>Contact</Link>
                </div>
              )}
            </li>

            {/* User Auth */}
            {user ? (
              <li className="nav-item dropdown user-dropdown">
                <button
                  className="btn custom-nav-btn user-icon-btn"
                  onClick={() => setDropdown(!dropdown)}
                >
                  {user.username}
                </button>
                {dropdown && (
                  <div className="user-dropdown-menu">
                    <button
  className="dropdown-item"
  onClick={() => {
    logout();
    setMenuOpen(false);
    navigate("/user/login"); // 👈 navigate to login page
  }}
>
  Logout
</button>

                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn custom-nav-btn" to="/user/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn custom-nav-btn" to="/user/login" onClick={() => setMenuOpen(false)}>Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
