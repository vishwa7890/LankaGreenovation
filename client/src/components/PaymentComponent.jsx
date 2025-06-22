import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const { amount, addressId, products } = location.state || {};
    console.log(products);
    
 
  if (!amount || !addressId || !products || !Array.isArray(products)) {
    return <p>Invalid payment data. Please go back and try again.</p>;
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/test1', {
        amount: amount,
      });

      const { order } = response.data;

      const options = {
        key: 'rzp_test_GiLijRlMnuemoM',
        amount: order.amount,
        currency: order.currency,
        name: 'My Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              'http://localhost:5000/user/test2',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyRes.status === 200) {
              const orderRes = await axios.post(
                'http://localhost:5000/user/create-order',
                {
                  razorpayOrderId: response.razorpay_order_id,
                  products: products.map((p) => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    price: p.price,
                  })),
                  addressId: addressId,
                  totalPrice: amount,
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
        prefill: {
          name: 'Test User',
          email: 'testuser@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
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
            <tr key={p.productId}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}> <img src={`http://localhost:5000/${p.productId.thumbnail.replace(/\\/g, "/")}`} alt="" width="100px" height="100px" /> </td>
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
            <td style={{ padding: '10px', fontWeight: 'bold' }}>₹{amount}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handlePayment}
        style={{ padding: '10px 20px', fontSize: '18px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Pay ₹{amount}
      </button>
    </div>
  );
};

export default PaymentComponent;
