import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import "../css/Footer.css"; // Ensure this path is correct

const Footer = () => {
  return (
    <footer className="lg-footer bg-dark text-white py-4">
      <div className="lg-footer-container">
        <div className="lg-footer-row">
          {/* Logo Section */}
          <div className="lg-footer-col lg-footer-logo-section">
            <img src="/Logo.jpg" alt="Lanka Greenovation" className="lg-footer-logo" />
          </div>

          {/* About & Quick Links */}
          <div className="lg-footer-col lg-footer-about">
            <h5 className="lg-footer-title">Lanka Greenovation</h5>
            <p className="lg-footer-text">
              Innovating sustainable biotech solutions for a greener future.
            </p>
            <div className="lg-footer-links">
              <a href="/AboutUs" className="lg-footer-link">About Us</a> |
              <a href="/user/productlist" className="lg-footer-link"> Products</a> |
              <a href="/ContactUs" className="lg-footer-link"> Contact</a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="lg-footer-col lg-footer-social">
            <h5 className="lg-footer-title">Follow Us</h5>
            <div className="lg-footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="lg-footer-social-link">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="lg-footer-social-link">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="lg-footer-social-link">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="lg-footer-social-link">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

       {/* Copyright Section */}
        <div className="lg-footer-copyright">
          <p>&copy; {new Date().getFullYear()} Lanka Greenovation. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;