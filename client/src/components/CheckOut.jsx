import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/CheckOut.css";
import {FaArrowLeft,
} from "react-icons/fa";

const CheckOut = () => {
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/get-address", { withCredentials: true })
      .then((res) => {
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0)
          setSelectedAddress(res.data.addresses[0]._id);
      })
      .catch(() => toast.error("Failed to fetch addresses"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/cart", { withCredentials: true })
      .then((res) => {
        setProducts(res.data.cart.items);
        const total = res.data.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      })
      .catch(() => toast.error("Failed to fetch cart"));
  }, []);

  const handleCheckout = async () => {
    if (!selectedAddress) return toast.error("Please select an address.");
    if (products.length === 0) return toast.error("Your cart is empty.");

    if (paymentMethod === "Online") {
      try {
        const res = await axios.post(
          "http://localhost:5000/user/initiate-payment",
          { totalPrice },
          { withCredentials: true }
        );
        const { id: orderId, amount, currency } = res.data.razorpayOrder;

        const options = {
          key: "rzp_test_GiLijRlMnuemoM", // TODO: Move to .env in production
          amount,
          currency,
          name: "Lanka",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                "http://localhost:5000/user/verify-payment",
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  addressId: selectedAddress,
                  paymentMethod: "Online",
                  products: products.map((p) => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    price: p.price,
                  })),
                  totalPrice,
                },
                { withCredentials: true }
              );

              toast.success("Payment and order successful!");
              setProducts([]);
              setTotalPrice(0);
              navigate("/user/orders");
            } catch (err) {
              toast.error("Payment verification failed.");
            }
          },
          theme: { color: "#4CAF50" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function () {
          toast.error("Payment failed.");
        });
        rzp.open();
      } catch (err) {
        toast.error("Failed to initiate payment.");
      }
    } else {
      try {
        const orderData = {
          addressId: selectedAddress,
          paymentMethod: "COD",
          products: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          })),
          totalPrice,
        };

        await axios.post(
          "http://localhost:5000/user/place-order",
          orderData,
          { withCredentials: true }
        );
        toast.success("Order placed successfully!");
        setProducts([]);
        setTotalPrice(0);
        navigate("/user/orders");
      } catch (err) {
        toast.error("Failed to place COD order.");
      }
    }
  };
  const handleBack=()=>{
    navigate("/user/cart");
  };

  const handleAdd = () => {
    navigate("/user/addadress");
  };

  const handleEdit = (id) => {
    navigate(`/user/updateaddress/${id}`);
  };

  const handleDelete = async (addressId) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p>Are you sure you want to delete this address?</p>
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await axios.delete(
                  `http://localhost:5000/user/delete-address/${addressId}`,
                  { withCredentials: true }
                );
                setAddresses((prev) =>
                  prev.filter((a) => a._id !== addressId)
                );
                if (selectedAddress === addressId) {
                  const remaining = addresses.filter(
                    (a) => a._id !== addressId
                  );
                  setSelectedAddress(
                    remaining.length > 0 ? remaining[0]._id : null
                  );
                }
                toast.success("Address deleted successfully!");
              } catch (err) {
                toast.error("Error deleting address");
              }
            }}
            style={{
              margin: "5px",
              padding: "5px 10px",
              background: "crimson",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              background: "#ccc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      ),
      { autoClose: false }
    );
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
      }} >
      <div className="checkout-container">
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
                    <button onClick={() => handleDelete(addr._id)}>
                      Delete
                    </button>
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
