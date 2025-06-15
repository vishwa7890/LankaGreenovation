import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaMapMarkedAlt,
  FaGlobe,
  FaMailBulk,
  FaLandmark
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../css/UpdateAddress.css"; // Make sure this file exists

const UpdateAddress = () => {
  const { id: addressId } = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/get-address/${addressId}`, {
          withCredentials: true,
        });

        if (response.data.address) {
          setAddress(response.data.address);
        } else {
          toast.error("Address not found");
        }
      } catch (err) {
        toast.error("Error fetching address details");
        console.error(err);
      }
    };

    if (addressId) {
      fetchAddress();
    }
  }, [addressId]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/user/updateaddress/${addressId}`,
        address,
        { withCredentials: true }
      );
      toast.success("Address updated successfully!");
      setTimeout(() => navigate("/user/checkout"), 1500);
    } catch (err) {
      toast.error("Error updating address");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "50px",
      }}
    >
      <div className="update-address-container">
        <h2>Update Address</h2>

        <form className="update-form" onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-field">
              <label><FaUser /> Full Name</label>
              <input type="text" name="fullName" value={address.fullName} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaPhone /> Phone</label>
              <input type="text" name="phone" value={address.phone} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaHome /> Address Line 1</label>
              <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaHome /> Address Line 2</label>
              <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label><FaCity /> City</label>
              <input type="text" name="city" value={address.city} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaMapMarkedAlt /> State</label>
              <input type="text" name="state" value={address.state} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaGlobe /> Country</label>
              <input type="text" name="country" value={address.country} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label><FaMailBulk /> Postal Code</label>
              <input type="text" name="postalCode" value={address.postalCode} onChange={handleChange} required />
            </div>

            <div className="form-field full-width">
              <label><FaLandmark /> Landmark (Optional)</label>
              <input type="text" name="landmark" value={address.landmark} onChange={handleChange} />
            </div>
          </div>

          <button type="submit">Update Address</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddress;
