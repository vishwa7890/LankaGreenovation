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

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/orders", {
          withCredentials: true,
        });
        setOrders(response.data.orders);
        console.log(response.data)
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleUpdate = (id) => {
    navigate(`/admin/updateorder/${id}`);
  };

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
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="admin-order-card">
              {/* Left Column: Order Info */}
              <div className="admin-order-left">
                <p>
                  <FaFingerprint /> <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <FaMoneyCheckAlt /> <strong>Total Price:</strong> ₹{order.totalPrice}
                </p>
                <p>
                  <FaMoneyCheckAlt /> <strong>Payment:</strong>{" "}
                  {order.paymentMethod} - {order.paymentStatus}
                </p>
                <p>
                  <FaBox /> <strong>Order Status:</strong> {order.orderStatus}
                </p>
                <p>
                  <FaCalendarAlt /> <strong>Placed On:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <h3>
                  <FaShippingFast /> Shipping Address
                </h3>
                <div className="admin-order-shipping-address">
                  {order.address ? (
                    <p>
                      {order.address.fullName}, {order.address.addressLine1},{" "}
                      {order.address.city}, {order.address.state} -{" "}
                      {order.address.postalCode}, {order.address.country}
                      <br />
                      <FaPhoneAlt /> <strong>Phone:</strong> {order.address.phone}
                    </p>
                  ) : (
                    <p>Address not available.</p>
                  )}
                </div>

                <button
                  className="admin-order-update-btn"
                  onClick={() => handleUpdate(order._id)}
                >
                  <FaEdit style={{ marginRight: "5px" }} />
                  Update
                </button>
              </div>

              {/* Right Column: Product List */}
              <div className="admin-order-right">
                <h3>🛒 Products</h3>
                <div className="admin-order-product-list">
                  {order.products.length > 0 ? (
                    order.products.map((product) => (
                      <div
                        key={product._id}
                        className="admin-order-product-info"
                      >
                        <img
                          src={`http://localhost:5000/${product.productId.thumbnail}`}
                          alt={product.productId.name}
                        />
                        <div>
                          <p><strong>Product:</strong> {product.productId.name}</p>

                          <strong>Description:</strong>
                          <ul>
                            {product.productId.shortDescription
                              .split('.')
                              .map((point, index) =>
                                point.trim() ? <li key={index}>{point.trim()}.</li> : null
                              )}
                          </ul>

                          <p><strong>Price:</strong> ₹{product.productId.price}</p>
                          <p><strong>Quantity:</strong> {product.quantity}</p>
                        </div>
                        </div>
                    ))
                  ) : (
                    <p>No products found.</p>
                  )}
                </div>
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
