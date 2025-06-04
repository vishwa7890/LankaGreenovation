import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="custom-navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Logo.jpg"
            alt="Lanka Greenovation Logo"
            className="custom-navbar-logo"
          />
          <span className="fw-bold custom-navbar-text">Lanka Greenovation</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="btn custom-nav-btn" to="/user/productlist">Products</Link>
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
                  <Link className="dropdown-item" to="/user/orders">Orders</Link>
                  <Link className="dropdown-item" to="/user/cart">Cart</Link>
                  <Link className="dropdown-item" to="/Gallery">Gallery</Link>
                  <Link className="dropdown-item" to="/aboutus">About</Link>
                  <Link className="dropdown-item" to="/ContactUs">Contact</Link>
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
                    <button className="dropdown-item" onClick={logout}>Logout</button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn custom-nav-btn" to="/user/register">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn custom-nav-btn" to="/user/login">Login</Link>
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
