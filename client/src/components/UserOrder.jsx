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
import LoadingSpinner from "../components/LoadingSpinner";
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
if (loading) {
  return (
    <>
      <Navbar />
      <LoadingSpinner />
    </>
  );
}

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

                    {/* Progress bar */}
                    <div className="mb-4 position-relative">
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

                      <div className="d-flex justify-content-between mt-3 position-relative" style={{ top: "-10px" }}>
                        {[
                          { label: "Pending", icon: faClock },
                          { label: "Processing", icon: faSpinner },
                          { label: "Shipped", icon: faTruck },
                          { label: "Delivered", icon: faBoxOpen },
                        ].map((step, index) => {
                          const isActive = statusStepIndex[order.orderStatus.toLowerCase()] >= index;
                          return (
                            <div key={index} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                              <div
                                className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${isActive ? "bg-success text-white" : "bg-light text-muted border"}`}
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
                        {order.products.map((product, index) => {
                          const p = product?.productId;
                          return p ? (
                            <div key={product._id || index} className="product-card">
                              <img
                                src={`http://localhost:5000/${p.thumbnail}`}
                                alt={p.name}
                                className="product-image"
                              />
                              <h5>{p.name}</h5>
                              <p><strong>₹{p.price}</strong></p>
                              <p>Qty: {product.quantity}</p>
                              <p className="desc">{p.description}</p>
                            </div>
                          ) : (
                            <div key={index} className="product-card">
                              <p>This product is no longer available.</p>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className="cancel-button"
                        disabled={["delivered", "cancelled", "user cancelled"].includes(order.orderStatus.toLowerCase())}
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel Order
                      </button><br></br>
                      {order.orderStatus.toLowerCase() !== "user cancelled" &&
 order.orderStatus.toLowerCase() !== "cancelled" && (
  <button
    className="print-btn"
    onClick={() => navigate(`/user/invoice/${order._id}`)}
  >
    View Invoice
  </button>
)}



                    </div>

                    {/* 💰 Order Amount Details */}
                    <div className="amount-breakdown">
  <h4>🧾 Amount Breakdown</h4>
  <table className="amount-table">
    <tbody>
      <tr>
        <td>Product Total</td>
        <td>₹{order.productTotal}</td>
      </tr>
      <tr>
        <td>GST (18%)</td>
        <td>₹{order.gst}</td>
      </tr>
      <tr>
        <td>Delivery Charge</td>
        <td>₹{order.deliveryCharge}</td>
      </tr>

      {/* Only show handling fee for COD */}
      {order.paymentMethod === "COD" && (
        <tr>
          <td>Handling Fee</td>
          <td>₹{order.handlingFee}</td>
        </tr>
      )}

      <tr>
        <td><strong>Total Amount</strong></td>
        <td><strong>₹{order.totalPrice}</strong></td>
      </tr>
    </tbody>
  </table>
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
