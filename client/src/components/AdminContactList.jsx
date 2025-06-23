import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminContactList.css"; // <-- New CSS for clean UI

const AdminContactList = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/contactdetails", {
        withCredentials: true,
      });

      const contactDetails = res.data.contactDetails;

      if (contactDetails.length === 0) {
        toast.info("No contact messages found.");
      } else {
        setContacts(contactDetails);
        toast.success("Contact messages loaded successfully.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login as admin.");
        navigate("/admin/login");
      } else {
        toast.error("Failed to fetch contact details.");
        console.error("Fetch error:", err);
      }
    }
  };

  fetchContacts();
}, [navigate]);


  return (
  <div className="admin-contact-list">
    <AdminNavbar />
    <div className="admin-contact-container">
      <h2 className="admin-contact-heading">📩 Contact Messages</h2>

      {contacts.length === 0 ? (
        <p className="no-data">No contact messages found.</p>
      ) : (
        <div className="contact-list">
          {contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <p className="contact-name">👤 {contact.name}</p>
              <p className="contact-email">📧 {contact.email}</p>
              <p className="contact-message">💬 {contact.message}</p>
              <p className="contact-date">
                🗓️ {new Date(contact.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    <ToastContainer />
  </div>
);

};

export default AdminContactList;
