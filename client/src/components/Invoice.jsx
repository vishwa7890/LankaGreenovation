import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Invoice.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/order/${orderId}`, {
          withCredentials: true,
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleBack = () => {
    navigate("/user/orders");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) return <p>Loading invoice...</p>;

  return (
    <div className="invoice-wrapper">
        <button className="back-btn" onClick={handleBack}>← Back</button>
      <div className="invoice-card">
        {/* 🖼️ Replace MyStore heading with image */}
        <header className="invoice-header">
          <img
            src="/pdf_head.jpeg"
            alt="Lanka Greenovation"
            className="invoice-logo"
          />
        </header>

        <section className="invoice-meta">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
        </section>

        <section className="address-box">
          <h3>Shipping Address</h3>
          <p>
            {order.address?.fullName}<br />
            {order.address?.addressLine1}<br />
            {order.address?.city}, {order.address?.state} - {order.address?.postalCode}<br />
            {order.address?.country}<br />
            Phone: {order.address?.phone}
          </p>
        </section>

        <section className="product-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, idx) => {
                const p = item.productId;
                return (
                  <tr key={idx}>
                    <td>{p?.name || 'Deleted Product'}</td>
                    <td>{item.quantity}</td>
                    <td>₹{p?.price}</td>
                    <td>₹{(p?.price * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="amount-summary">
          <table>
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
              <tr className="total">
                <td><strong>Total</strong></td>
                <td><strong>₹{order.totalPrice}</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        <button className="print-btn" onClick={handlePrint}>🖨️ Print Invoice</button>
      </div>
    </div>
  );
};

export default Invoice;
