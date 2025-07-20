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
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminOrder = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
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
      orderId.includes(term) || fullName.includes(term) || status.includes(term);

    const orderDate = new Date(order.createdAt);
    const matchesMonth = searchMonth
      ? orderDate.getMonth() + 1 === parseInt(searchMonth)
      : true;
    const matchesYear = searchYear
      ? orderDate.getFullYear() === parseInt(searchYear)
      : true;

    return matchesText && matchesMonth && matchesYear;
  });

 const exportToExcel = () => {
  if (filteredOrders.length === 0) {
    toast.warn("No data available to export");
    return;
  }

  // Get month & year from the first filtered order
  const firstDate = new Date(filteredOrders[0].createdAt);
  const month = firstDate.toLocaleString("default", { month: "long" }); // e.g. "July"
  const year = firstDate.getFullYear();

  const sheetName = `${month}_${year}`;
  const fileName = `Order_Report_${sheetName}.xlsx`;

  const data = filteredOrders.map((order) => {
    const productDetails = order.products
      .map((p) => `${p.productId?.name} (x${p.quantity}) - ₹${p.price}`)
      .join("\n");

    const productTotal = order.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const gst = parseFloat((productTotal * 0.18).toFixed(2));
    const deliveryCharge = 50;
    const handlingFee = order.paymentMethod === "COD" ? 30 : 0;
    const finalAmount = Math.round(productTotal + gst + deliveryCharge + handlingFee);

    return {
      "Order ID": order._id,
      "Customer": order.address?.fullName || "N/A",
      "Date": new Date(order.createdAt).toLocaleDateString("en-IN"),
      "Products": productDetails,
      "Product Total (₹)": productTotal,
      "GST (18%) (₹)": gst,
      "Delivery Charge (₹)": deliveryCharge,
      "Handling Fee (₹)": handlingFee,
      "Final Total (₹)": finalAmount,
      "Payment Method": order.paymentMethod,
      "Status": order.orderStatus,
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};


  
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminNavbar />
      {loading && (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
)}

      <div style={{ padding: "30px" }}>
        <div className="admin-order-container">
          <h2 className="admin-order-title">📦 Orders</h2>

          <div className="admin-order-filters">
            <input
              type="text"
              placeholder="🔍 Search ID, Name, Status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
            <select
              value={searchMonth}
              onChange={(e) => setSearchMonth(e.target.value)}
              className="filter-input"
            >
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select
  value={searchYear}
  onChange={(e) => setSearchYear(e.target.value)}
  className="filter-input"
>
  <option value="">Year</option>
  {Array.from({ length: 5 + 1 + 10 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    const year = currentYear - 5 + i; // start from 5 years ago
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  })}
</select>

            <button className="clear-filter-btn" onClick={() => {
              setSearchTerm("");
              setSearchMonth("");
              setSearchYear("");
            }}>
              ❌
            </button>

            <button className="excel-btn" onClick={exportToExcel}>
              <FaFileExcel style={{ marginRight: 6 }} /> Export Excel
            </button>
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
                    <FaMoneyCheckAlt /> <strong>Payment:</strong>{" "}
                    <span
                      style={{
                        color: order.paymentStatus === "Paid" ? "green" : "red",
                      }}
                    >
                      {order.paymentMethod} - {order.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <FaBox /> <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          order.orderStatus === "Pending"
                            ? "gray"
                            : order.orderStatus === "Processing"
                            ? "blue"
                            : order.orderStatus === "Shipped"
                            ? "orange"
                            : order.orderStatus === "Delivered"
                            ? "green"
                            : "red",
                      }}
                    >
                      {order.orderStatus}
                    </span>
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
