import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import "../css/ContactUs.css"; // Import custom styles
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa"; // Icons for contact details

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="contact-bg">
      <Navbar />

      <div className="container contact-container" data-aos="fade-up">
        {/* Left Side - Contact Image */}
        <div className="contact-left" data-aos="fade-right">
          <img src="/cont.jpg" alt="Contact Us" className="contact-image" />
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form" data-aos="fade-left">
          <h2 className="contact-heading">Get in Touch</h2>
          <p className="lead text-muted">
            We'd love to hear from you! Reach out to us anytime.
          </p>

          {/* Contact Info */}
          <div className="contact-info">
            <p data-aos="zoom-in">
              <FaEnvelope className="icon" />
              <a href="mailto:support@lankagreenovation.com">support@lankagreenovation.com</a>
            </p>
            <p data-aos="zoom-in">
              <FaPhoneAlt className="icon" />
              <a href="tel:+919876543210">+91 9876543210</a>
            </p>
          </div>

          {/* Contact Form */}
          <form>
            <div className="form-group" data-aos="fade-up">
              <input type="text" className="contact-input" placeholder="Your Name" required />
            </div>
            <div className="form-group" data-aos="fade-up">
              <input type="email" className="contact-input" placeholder="Your Email" required />
            </div>
            <div className="form-group" data-aos="fade-up">
              <textarea className="contact-input" rows="4" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="contact-btn" data-aos="zoom-in">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;