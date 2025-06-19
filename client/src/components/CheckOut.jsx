import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/CheckOut.css";

const CheckOut = () => {
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/user/addadress");
  };
  const handleBack = () => navigate(-1);
  useEffect(() => {
    axios.get("http://localhost:5000/user/get-address", { withCredentials: true })
      .then(res => {
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) setSelectedAddress(res.data.addresses[0]._id);
      })
      .catch(err => toast.error("Failed to fetch addresses"));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/user/cart", { withCredentials: true })
      .then(res => {
        setProducts(res.data.cart.items);
        const total = res.data.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
      })
      .catch(err => toast.error("Failed to fetch cart"));
  }, []);

  const handleCheckout = async () => {
    if (!selectedAddress) return toast.error("Please select an address.");
    if (products.length === 0) return toast.error("Your cart is empty.");

    if (paymentMethod === "Online") {
      try {
        const res = await axios.post("http://localhost:5000/user/initiate-payment", { totalPrice }, { withCredentials: true });
        const { id: orderId, amount, currency } = res.data.razorpayOrder;

        const options = {
          key: "rzp_test_GiLijRlMnuemoM",
          amount,
          currency,
          name: "Lanka",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post("http://localhost:5000/user/verify-payment", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                addressId: selectedAddress,
                paymentMethod: "Online",
                products: products.map(p => ({
                  productId: p.productId,
                  quantity: p.quantity,
                  price: p.price
                })),
                totalPrice
              }, { withCredentials: true });

              toast.success("Payment and order successful!");
              navigate("/user/orders");
              console.log(verifyRes);
            } catch (err) {
              toast.error("Payment verification failed.");
            }
          },
          theme: { color: "#4CAF50" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error("Failed to initiate payment.");
      }
    } else {
      try {
        const orderData = {
          addressId: selectedAddress,
          paymentMethod: "COD",
          products: products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price
          })),
          totalPrice
        };

        await axios.post("http://localhost:5000/user/place-order", orderData, { withCredentials: true });
        toast.success("Order placed successfully!");
        navigate("/user/orders");
      } catch (err) {
        toast.error("Failed to place COD order.");
      }
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <div className="checkout-container">
        {/* Back Button */}
      <button onClick={handleBack} className="back-btn">
        ← Back
      </button>
        <h2 className="title">Checkout</h2>

        <div className="section">
          <h3>Select Delivery Address:</h3>
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr._id} className="address-card animate-slide">
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                />
                <label>
                  <strong>{addr.fullName}</strong> - {addr.phone}
                  <p>
                    {addr.addressLine1}, {addr.city}, {addr.state},{" "}
                    {addr.postalCode}, {addr.country}
                    <button onClick={() => handleEdit(addr._id)}>Edit</button>
                    <button onClick={() => handleDelete(addr._id)}>Delete</button>
                  </p>
                </label>
              </div>
            ))
          ) : (
            <p>No address found.</p>
          )}
          <button onClick={handleAdd} className="green-btn">
            Add Address
          </button>
        </div>

        <div className="section">
          <h3>Select Payment Method:</h3>
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="payment"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={() => setPaymentMethod("Online")}
            />
            Online Payment
          </label>
        </div>

        <button onClick={handleCheckout} className="green-btn">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
