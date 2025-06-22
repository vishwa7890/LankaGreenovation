import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AdminOrder.css";
import AdminNavbar from "../components/AdminNavbar";
import {
  FaBox,
  FaShippingFast,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaEdit,
  FaFingerprint,
  FaPhoneAlt
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders", {
          withCredentials: true,
        });

        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error("Unauthorized. Please login as admin.");
          navigate("/admin/login");
        } else {
          setError("Failed to fetch orders.");
          toast.error("Failed to fetch orders.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleUpdate = (id) => {
    navigate(`/admin/updateorder/${id}`);
  };

  const filteredOrders = orders.filter((order) => {
    const fullName = order.address?.fullName?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase();
    const status = order.orderStatus?.toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesText =
      orderId.includes(term) ||
      fullName.includes(term) ||
      status.includes(term);

    const matchesDate = searchDate
      ? new Date(order.createdAt).toISOString().slice(0, 10) === searchDate
      : true;

    return matchesText && matchesDate;
  });

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
          padding: "30px",
        }}
      >
        <div className="admin-order-container">
          <h2 className="admin-order-title">📦 Orders</h2>

        <div className="admin-order-filters">
  <div className="filter-group">
    <label htmlFor="search" className="filter-label">🔍 Search</label>
    <input
      type="text"
      id="search"
      placeholder="Order ID, Name, or Status"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="filter-input"
    />
  </div>

  <div className="filter-group">
    <label htmlFor="date" className="filter-label">📅 Date</label>
    <input
      type="date"
      id="date"
      value={searchDate}
      onChange={(e) => setSearchDate(e.target.value)}
      className="filter-input"
    />
  </div>

  <div className="filter-group" style={{ alignSelf: "center" }}>
    <button
      className="clear-filter-btn"
      onClick={() => {
        setSearchTerm("");
        setSearchDate("");
      }}
    >
      ❌ 
    </button>
  </div>
</div>



          {filteredOrders.length === 0 ? (
            <p>No matching orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="admin-order-card">
 <div className="admin-order-summary">
  <p>
    <FaFingerprint /> <strong>Order ID:</strong> {order._id}
  </p>
  <p>
    👤 <strong>Customer:</strong> {order.address?.fullName || "N/A"}
  </p>
  <p>
    <FaMoneyCheckAlt /> <strong>Total Price:</strong> ₹{order.totalPrice}
  </p>
  <p>
    <FaMoneyCheckAlt /> <strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}
  </p>
  <p>
    <FaBox /> <strong>Status:</strong> {order.orderStatus}
  </p>
  <p>
    <FaCalendarAlt /> <strong>Placed On:</strong>{" "}
    {new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </p>

  <button
    className="admin-order-update-btn"
    onClick={() => handleUpdate(order._id)}
  >
    <FaEdit style={{ marginRight: "5px" }} />
    View / Update
  </button>
</div>
</div>

            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
