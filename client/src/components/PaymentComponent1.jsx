import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentComponent1 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { amount, addressId, products } = location.state || {};

  if (!amount || !addressId || !products || !Array.isArray(products)) {
    return <p>Invalid payment data. Please go back and try again.</p>;
  }

  const handlePayment = async () => {
    try {
      const orderRes = await axios.post(
        'http://localhost:5000/user/create-order-cod',
        {
          products: products.map((p) => ({
            productId: p.productId, // fallback if only ID is present
            quantity: p.quantity,
            price: p.price,
          })),
          addressId,
          totalPrice: amount,
          paymentMethod: 'COD',
        },
        { withCredentials: true }
      );

      toast.success('Order placed successfully!');
      navigate('/user/orders');
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Order Summary</h2>
      <table
        style={{
          width: '80%',
          margin: 'auto',
          borderCollapse: 'collapse',
          marginBottom: '20px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Image</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Product Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Quantity</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Price (₹)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Subtotal (₹)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={p.productId._id || p.productId}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <img
                  src={`http://localhost:5000/${p.productId.thumbnail.replace(/\\/g, "/")}`}
                  alt="product"
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{p.productId.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{p.quantity}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>₹{p.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                ₹{p.price * p.quantity}
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <td colSpan="4" style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
              Total:
            </td>
            <td colSpan="2" style={{ padding: '10px', fontWeight: 'bold' }}>₹{amount}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Order Now
      </button>
    </div>
  );
};

export default PaymentComponent1;
