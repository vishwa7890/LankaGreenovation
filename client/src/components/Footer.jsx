import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import "../css/Footer.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 - Logo and About */}
        <div className="footer-section">
          <img
            src="/Logo.jpg"
            alt="Lanka Greenovation"
            className="footer-logo"
          />
          <h3 className="footer-brand">Lanka Greenovation</h3>
          <p className="footer-description">
            Innovating sustainable biotech solutions for a greener future.
          </p>
        </div>

        {/* Column 2 - Contact Information */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p><FaMapMarkerAlt className="footer-icon" /> D NO6/780-16, R. S. Nagar, Virudhunagar-626001, Tamil Nadu</p>
          <p><FaPhoneAlt className="footer-icon" /> +91 99442 15859</p>
          <p><FaPhoneAlt className="footer-icon" /> +91 77083 85859</p>
          <p><FaEnvelope className="footer-icon" />
            <a href="mailto:lankagreenovation@gmail.com">lankagreenovation@gmail.com</a>
          </p>
          <p><FaGlobe className="footer-icon" />
            <a href="https://www.lankagreenovation.com" target="_blank" rel="noopener noreferrer">
              www.lankagreenovation.com
            </a>
          </p>
        </div>

        {/* Column 3 - Quick Links and Socials */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/AboutUs">About Us</a></li>
            <li><a href="/user/productlist">Products</a></li>
            <li><a href="/ContactUs">Contact</a></li>
          </ul>
          <h4 className="footer-heading mt-3">Follow Us</h4>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://x.com/LGreenovation" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com/in/lankagreenovation" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/lankagreenovation/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lanka Greenovation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
