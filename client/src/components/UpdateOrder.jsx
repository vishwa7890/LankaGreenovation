import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/UpdateOrder.css";
import LoadingSpinner from "../components/LoadingSpinner";

const UpdateOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [isFinalStatus, setIsFinalStatus] = useState(false);
  const [finalLockedMessage, setFinalLockedMessage] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/orders/${id}`, {
          withCredentials: true,
        });

        if (response.data.orders) {
          setOrder(response.data.orders);
          const status = response.data.orders.orderStatus || "Pending";
          setOrderStatus(status);
          if (["delivered", "cancelled", "user cancelled"].includes(status.toLowerCase())) {
            setIsFinalStatus(true);
            setFinalLockedMessage(true);
          }
        } else {
          toast.error("Order not found.");
        }
      } catch (err) {
        toast.error("Failed to fetch order");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/update-order/${id}`,
        { orderStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully!");

      // ✅ Lock if final status
      if (
        ["delivered", "cancelled", "user cancelled"].includes(
          orderStatus.toLowerCase()
        )
      ) {
        setIsFinalStatus(true);
        setFinalLockedMessage(true);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  if (loading) {
  return (
    <div className="loading-overlay">
      <LoadingSpinner />
    </div>
  );
}


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "30px",
      }}
    >
      <div className="update-order-container">
        <button className="back-btn" onClick={() => navigate("/admin/orders")}>
          Back
        </button>

        <h2 className="update-order-heading">🛠️ Update Order Details</h2>

        {order ? (
          <div key={order._id} className="order-info">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
            <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
            <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <div className="status-section">
              <label><strong>Order Status:</strong></label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="status-select"
                disabled={isFinalStatus}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="User Cancelled">User Cancelled</option>
              </select>
              <button
                onClick={handleUpdate}
                className="update-button"
                disabled={isFinalStatus}
              >
                ✅ Update Order
              </button>
              {finalLockedMessage && (
                <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>
                  ✅ Final Status Locked — No further updates allowed.
                </p>
              )}
            </div>

            <hr className="section-divider" />

            <h3 className="section-title">📦 Shipping Address</h3>
            <div className="address-info">
              {order.address ? (
                <p>
                  {order.address.fullName},<br />
                  {order.address.addressLine1}, {order.address.city},<br />
                  {order.address.state} - {order.address.postalCode}, {order.address.country}<br />
                  <strong>Phone:</strong> {order.address.phone}
                </p>
              ) : (
                <p>Address not available.</p>
              )}
            </div>

            <h3 className="section-title">🛒 Products</h3>
            {order.products?.length > 0 ? (
              order.products.map((product, index) => (
                <div key={product._id || index} className="product-card">
                  <img
                    src={`http://localhost:5000/${product.productId?.thumbnail}`}
                    alt={product.productId?.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <p><strong>Product:</strong> {product.productId?.name || "Unknown"}</p>
                    <p><strong>Description:</strong> {product.productId?.description || "No description"}</p>
                    <p><strong>Price:</strong> ₹{product.productId?.price}</p>
                    <p><strong>Quantity:</strong> {product.quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}

            <h3 className="section-title">💰 Amount Breakdown</h3>
            <div className="amount-breakdown">
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
                  {order.paymentMethod === "COD" && (
                    <tr>
                      <td>Handling Fee</td>
                      <td>₹{order.handlingFee}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>Total Amount</strong></td>
                    <td><strong>₹{order.totalPrice}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No order found.</p>
        )}
      </div>
    </div>
  );
};

export default UpdateOrder;
