import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/ContactUs.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:5000/user/contact", {
      name,
      email,
      message,
    });

    toast.success(response.data.message || "Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  } catch (error) {
    const msg =
      error.response?.data?.message || "Something went wrong. Please try again.";
    toast.error(msg);
  }
};


  return (
    <div className="contact-bg">
      <Navbar />

      <div className="container contact-container" data-aos="fade-up">
        <div className="contact-left" data-aos="fade-right">
          <img src="/cont.jpg" alt="Contact Us" className="contact-image" />
        </div>

        <div className="contact-form" data-aos="fade-left">
          <h2 className="contact-heading">Get in Touch</h2>
          <p className="lead text-muted">
            We'd love to hear from you! Reach out to us anytime.
          </p>

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
          <form onSubmit={handleSubmit}>
            <div className="form-group" data-aos="fade-up">
              <input
                type="text"
                className="contact-input"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" data-aos="fade-up">
              <input
                type="email"
                className="contact-input"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" data-aos="fade-up">
              <textarea
                className="contact-input"
                rows="4"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
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
