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
  <div className="contact-card">
    <div className="contact-header">
     
      <h2>📩 Contact Messages</h2>
    </div>

    {contacts.length === 0 ? (
      <p className="no-data">No contact messages found.</p>
    ) : (
      <div className="table-wrapper">
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
               <td>
                {new Date(contact.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

  );
};

export default AdminContactList;
