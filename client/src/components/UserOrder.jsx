import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/UserOrder.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSpinner,
  faTruck,
  faBoxOpen
} from "@fortawesome/free-solid-svg-icons";


const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const statusStepIndex = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/orders", {
          withCredentials: true,
        });

        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await axios.put(
        "http://localhost:5000/user/cancel",
        { orderId: id },
        { withCredentials: true }
      );
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error cancelling order:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
          padding: "30px",
        }}
      >
        <div className="order-page">
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
            <FaArrowLeft style={{ marginRight: "5px" }} /> Back
          </button>

          <h2 className="order-title">🛍️ Your Orders</h2>

          {loading && <p className="order-loading">Loading orders...</p>}
          {error && <p className="order-error">{error}</p>}

          {!loading && !error && (
            <div className="order-list">
              {orders.length === 0 ? (
                <p className="order-empty">No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <h3>Order ID: {order._id}</h3>
                      <p className={`status ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </p>
                    </div>

                    <div className="order-info">
                      <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>

                 {/* Order Progress with Font Awesome Icons & Animation */}
<div className="mb-4 position-relative">
  {/* Animated Progress Bar */}
  <div className="progress" style={{ height: "8px", borderRadius: "5px" }}>
    <div
      className="progress-bar bg-success progress-bar-striped progress-bar-animated"
      role="progressbar"
      style={{
        width: `${(statusStepIndex[order.orderStatus.toLowerCase()] / 3) * 100}%`,
        borderRadius: "5px",
        transition: "width 1s ease-in-out",
      }}
      aria-valuenow={(statusStepIndex[order.orderStatus.toLowerCase()] / 3) * 100}
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>

  {/* Step Icons & Labels */}
  <div className="d-flex justify-content-between mt-3 position-relative" style={{ top: "-10px" }}>
    {[
      { label: "Pending", icon: faClock },
      { label: "Processing", icon: faSpinner },
      { label: "Shipped", icon: faTruck },
      { label: "Delivered", icon: faBoxOpen },
    ].map((step, index) => {
      const isActive = statusStepIndex[order.orderStatus.toLowerCase()] >= index;
      return (
        <div
          key={index}
          className="text-center"
          style={{ flex: 1, zIndex: 1 }}
        >
          <div
            className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${
              isActive ? "bg-success text-white" : "bg-light text-muted border"
            }`}
            style={{
              width: "34px",
              height: "34px",
              fontSize: "16px",
            }}
          >
            <FontAwesomeIcon icon={step.icon} />
          </div>
          <div style={{ fontSize: "13px" }}>{step.label}</div>
        </div>
      );
    })}
  </div>
</div>




                    <div className="shipping-box">
                      <h4>📦 Shipping Address</h4>
                      {order.address ? (
                        <p>
                          {order.address.fullName}<br />
                          {order.address.addressLine1},<br />
                          {order.address.city}, {order.address.state} - {order.address.postalCode}<br />
                          {order.address.country}<br />
                          <strong>Phone:</strong> {order.address.phone}
                        </p>
                      ) : (
                        <p>Address not available.</p>
                      )}
                    </div>

                    <div className="product-box">
                      <h4>🧾 Ordered Products</h4>
                      <div className="product-grid">
                        {order.products.map((product) => (
                          <div key={product._id} className="product-card">
                            <img
                              src={`http://localhost:5000/${product.productId.thumbnail}`}
                              alt={product.productId.name}
                              className="product-image"
                            />
                            <h5>{product.productId.name}</h5>
                            <p><strong>₹{product.productId.price}</strong></p>
                            <p>Qty: {product.quantity}</p>
                            <p className="desc">{product.productId.description}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        className="cancel-button"
                        disabled={[
                          "delivered",
                          "cancelled",
                          "user cancelled",
                        ].includes(order.orderStatus.toLowerCase())}
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
