import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faCity,
  faFlag,
  faGlobe,
  faEnvelope,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AddAddress.css";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    landmark: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/addadress",
        formData,
        { withCredentials: true }
      );

      toast.success(response.data.message || "Address added successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        landmark: "",
      });

      setTimeout(() => navigate("/user/checkout"), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding address", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <ToastContainer />
      <div className="add-address-card">
        <h2 className="add-address-title">Add Address</h2>

        <form className="add-address-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faPhone} className="icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faCity} className="icon" />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faFlag} className="icon" />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faGlobe} className="icon" />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLandmark} className="icon" />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="add-address-button">
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
