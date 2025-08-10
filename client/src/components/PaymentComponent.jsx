import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/PaymentComponent.css';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from "../components/LoadingSpinner";

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  const { addressId, products } = location.state || {};
  const [summary, setSummary] = useState(null);
  const paymentMethod = "Online";

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/user/order-summary",
          {
            products,
            paymentMethod
          },
          { withCredentials: true }
        );
        setSummary(res.data);
      } catch (error) {
        toast.error("Failed to fetch order summary");
        console.error(error);
      }
    };

    if (products && addressId) {
      fetchSummary();
    }
  }, [products, addressId]);

  const handlePayment = async () => {
    try {
      const finalAmount = summary.totalPrice;

      const response = await axios.post('http://localhost:5000/user/test1', { amount: finalAmount });
      const { order } = response.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Lanka Greenovation',
        description: 'Order Payment',
        order_id: order.id,
        prefill: {
          contact: '',
          email: '',
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              'http://localhost:5000/user/test2',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: finalAmount,
              },
              { withCredentials: true }
            );

            if (verifyRes.status === 200) {
              await axios.post(
                'http://localhost:5000/user/create-order',
                {
                  razorpayOrderId: response.razorpay_order_id,
                  products: products.map((p) => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    price: p.price,
                  })),
                  addressId,
                  totalPrice: finalAmount,
                  paymentMethod: 'Online',
                },
                { withCredentials: true }
              );

              toast.success('Order placed successfully!');
              navigate('/user/orders');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification/Order Error:', err);
            toast.error('Payment or Order failed');
          }
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  if (!summary) return <p>Loading...</p>;

  return (
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
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>Product Total:</td>
              <td>₹{summary.productTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>GST (18%):</td>
              <td>₹{summary.gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>Delivery Charge:</td>
              <td>₹{summary.deliveryCharge}</td>
            </tr>
            {summary.handlingFee > 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'right' }}>Handling Fee:</td>
                <td>₹{summary.handlingFee}</td>
              </tr>
            )}
            <tr className="payment-summary">
              <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Final Total:
              </td>
              <td style={{ fontWeight: 'bold' }}>₹{summary.totalPrice}</td>
            </tr>
          </tbody>
        </table>
        <div className="pay-container">
          <button className="pay-btn" onClick={handlePayment}>
            Pay ₹{summary.totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
