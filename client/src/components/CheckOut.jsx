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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/get-address", {
          withCredentials: true,
        });
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]._id);
        }
      } catch (err) {
        toast.error("Error fetching addresses");
        console.error(err);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/cart", {
          withCredentials: true,
        });
        setProducts(response.data.cart.items);

        const total = response.data.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      } catch (err) {
        toast.error("Error fetching cart items");
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderData = {
      addressId: selectedAddress,
      paymentMethod,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
    };

    if (paymentMethod === "Online") {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/place-order",
          orderData,
          {
            withCredentials: true,
          }
        );

        if (response.data.razorpayOrder) {
          const { id: orderId, amount, currency } = response.data.razorpayOrder;

          const options = {
            key: "rzp_test_73Og2QB6bRrFB9",
            amount,
            currency,
            name: "Lanka",
            description: "Test Transaction",
            order_id: orderId,
            handler: async function (response) {
              try {
                const verifyRes = await axios.post(
                  "http://localhost:5000/user/verify-payment",
                  {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                  { withCredentials: true }
                );

                toast.success(verifyRes.data.message || "Payment Successful!");
                navigate("/user/orders");
              } catch (verifyErr) {
                console.error("Payment verification failed:", verifyErr);
                toast.error("Payment verification failed. Please try again.");
              }
            },
            prefill: {
              name: "Customer Name",
              email: "customer@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#4CAF50",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } catch (err) {
        toast.error("Error initiating payment");
        console.error(err);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/place-order",
          orderData,
          { withCredentials: true }
        );
        toast.success(response.data.message || "Order placed successfully!");
        navigate("/user/orders");
      } catch (err) {
        toast.error("Error placing order");
        console.error(err);
      }
    }
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
              setAddresses((prev) => prev.filter((a) => a._id !== addressId));
              if (selectedAddress === addressId) {
                const remaining = addresses.filter((a) => a._id !== addressId);
                setSelectedAddress(remaining.length > 0 ? remaining[0]._id : null);
              }
              toast.success("Address deleted successfully!");
            } catch (err) {
              toast.error("Error deleting address");
              console.error(err);
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
      }}
    >
      <div className="checkout-container">
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
