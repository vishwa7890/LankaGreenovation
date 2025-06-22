import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/CheckOut.css";
import {
  FaArrowLeft,
} from "react-icons/fa";

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
  const handleBack = () => navigate("/user/cart");
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
     
     navigate('/user/pay', {
      state: {
        amount: totalPrice,
        addressId: selectedAddress,
        paymentMethod: "Online",
        products: products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price
        }))
      }
    });
     console.log(totalPrice);
     
    } else {
      /*try {
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

        await axios.post("http://localhost:5000/user/place-order-cod", orderData, { withCredentials: true });
        toast.success("Order placed successfully!");
        navigate("/user/orders");
      } catch (err) {
        toast.error("Failed to place COD order.");
      }*/
     navigate('/user/pay-cod', {
      state: {
        amount: totalPrice,
        addressId: selectedAddress,
        paymentMethod: "COD",
        products: products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price
        }))
      }
    });
     console.log(totalPrice);
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
     <button
               onClick={handleBack}
               style={{
                 background: "none",
                 border: "none",
                 fontSize: "16px",
                 fontWeight: "bold",
                 cursor: "pointer",
                 marginBottom: "15px",
                 display: "flex",
                 alignItems: "center",
                 color: "#333",
               }}
             >
               <FaArrowLeft style={{ marginRight: "5px" }} /> Back
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
