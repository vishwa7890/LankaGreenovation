import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/UserOrder.css"; // 👈 Add this line to include CSS
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };  
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/orders", {
        withCredentials: true,
      });

      // Sort orders by createdAt in descending order (latest first)
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
      <h2 className="order-title">🛍️ Your Orders</h2>
      <button className="back-button" onClick={goToHome}>🏠 Back to Home</button>


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
                      hour12: true
                    })}
                  </p>
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
