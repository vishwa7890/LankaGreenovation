import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/PaymentComponent.css'; // ✅ ADD THIS
import { FaArrowLeft } from 'react-icons/fa';

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { amount, addressId, products } = location.state || {};
  if (!amount || !addressId || !products || !Array.isArray(products)) {
    return <p>Invalid payment data. Please go back and try again.</p>;
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/test1', { amount });
      const { order } = response.data;

      const options = {
        key: 'rzp_live_gpNbVGKz3wc8cQ',
        amount: order.amount,
        currency: order.currency,
        name: 'Lanka Greenovation',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('http://localhost:5000/user/test2', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });

            if (verifyRes.status === 200) {
              await axios.post('http://localhost:5000/user/create-order', {
                razorpayOrderId: response.razorpay_order_id,
                products: products.map(p => ({
                  productId: p.productId,
                  quantity: p.quantity,
                  price: p.price,
                })),
                addressId,
                totalPrice: amount,
                paymentMethod: 'Online',
              }, { withCredentials: true });

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

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft style={{ marginRight: "6px" }} /> Back
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
                  src={`http://localhost:5000/${p.productId.thumbnail.replace(/\\/g, '/')}`}
                  alt=""
                />
              </td>
              <td>{p.productId.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>₹{p.price * p.quantity}</td>
            </tr>
          ))}
          <tr className="payment-summary">
            <td colSpan="4" style={{ textAlign: 'right' }}>Total:</td>
            <td colSpan="2">₹{amount}</td>
          </tr>
        </tbody>
      </table>
      <div className="pay-container">
      <button className="pay-btn" onClick={handlePayment}>
        Pay ₹{amount}
      </button>
      </div>
    </div>
    </div>
  );
};

export default PaymentComponent;
