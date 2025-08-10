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
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate("/user/checkout");
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    
    // Basic phone number validation: required and digits only (modify as needed)
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    else if (!/^\d{7,15}$/.test(formData.phone.trim()))
      newErrors.phone = "Phone must be 7 to 15 digits.";

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal Code is required.";

    // Optional: you can add more postal code format validation if needed

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    setErrors({});
    setLoading(true);
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
    } finally {
      setLoading(false);
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
      {loading && <LoadingSpinner />}
      <div className="add-address-card">
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            color: "#333",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "5px" }} /> Back
        </button>
        <h2 className="add-address-title">Add Address</h2>

        <form className="add-address-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <small className="error-text">{errors.fullName}</small>}
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faPhone} className="icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <small className="error-text">{errors.phone}</small>}
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              className={errors.addressLine1 ? "input-error" : ""}
            />
            {errors.addressLine1 && (
              <small className="error-text">{errors.addressLine1}</small>
            )}
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
              className={errors.city ? "input-error" : ""}
            />
            {errors.city && <small className="error-text">{errors.city}</small>}
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faFlag} className="icon" />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "input-error" : ""}
            />
            {errors.state && <small className="error-text">{errors.state}</small>}
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faGlobe} className="icon" />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? "input-error" : ""}
            />
            {errors.country && <small className="error-text">{errors.country}</small>}
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? "input-error" : ""}
            />
            {errors.postalCode && (
              <small className="error-text">{errors.postalCode}</small>
            )}
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

          <button
            type="submit"
            className="add-address-button"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
