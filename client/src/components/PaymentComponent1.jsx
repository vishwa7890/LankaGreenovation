import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/PaymentComponent.css';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from "../components/LoadingSpinner";

const PaymentComponent1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId, products } = location.state || {};
  const [loading, setLoading] = useState(true);
const [placingOrder, setPlacingOrder] = useState(false);


  const [summary, setSummary] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  if (!addressId || !products || !Array.isArray(products)) {
    return <p>Invalid payment data. Please go back and try again.</p>;
  }

  useEffect(() => {
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/user/order-summary',
        {
          products: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          })),
          paymentMethod: "COD",  // ✅ Add this line
        },
        { withCredentials: true }
      );
      setSummary(res.data);
    } catch (err) {
      toast.error('Failed to load order summary');
    }finally {
      setLoading(false); // Stop loading
    }
  };

  fetchSummary();
}, [products]);


  const handlePayment = async () => {
  try {
    setPlacingOrder(true);
    const res = await axios.post(
      'http://localhost:5000/user/create-order-cod',
      {
        products: products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
        addressId,
        paymentMethod: "COD",
      },
      { withCredentials: true }
    );

    toast.success('Order placed successfully!');
    setOrderDetails(res.data.order);
    setTimeout(() => {
      navigate('/user/orders');
    }, 1000); 

  } catch (error) {
    console.error('Payment initiation error:', error);
    toast.error('Failed to place order');
  }finally {
    setPlacingOrder(false); // Stop placing
  }
};


  return loading ? (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
) : (
    <div className="payment-wrapper">
      
      <div className="payment-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: '6px' }} /> Back
        </button>

        <h2 className="payment-header">Order Summary</h2>

        <table className="payment-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.productId._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={p.productId.thumbnail?.url}
                    alt=""
                  />
                </td>
                <td>{p.productId.name}</td>
                <td>{p.quantity}</td>
                <td>₹{p.price}</td>
                <td>₹{(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}

            {summary && (
              <>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}>Product Total:</td>
                  <td>₹{summary.productTotal}</td>
                </tr>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}>GST (18%):</td>
                  <td>₹{summary.gst}</td>
                </tr>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}>Delivery Charge:</td>
                  <td>₹{summary.deliveryCharge}</td>
                </tr>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'right' }}>Handling Fee:</td>
                  <td>₹{summary.handlingFee}</td>
                </tr>
                <tr className="payment-summary">
                  <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Final Total:
                  </td>
                  <td style={{ fontWeight: 'bold' }}>₹{summary.totalPrice}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

{!orderDetails && (
  <div className="pay-container">
    <button
      className="pay-btn"
      onClick={handlePayment}
      disabled={placingOrder}
    >
      Order Now ₹{summary?.totalPrice || ''}
    </button>
  </div>
)}
{placingOrder && (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
)}

      </div>
    </div>
  );
};

export default PaymentComponent1;
