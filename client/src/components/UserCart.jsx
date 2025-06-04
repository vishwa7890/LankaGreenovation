import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaEye, FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import "../css/UserCart.css"; // Import the green-themed CSS
import Navbar from "../components/Navbar";

const UserCart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/cart", { withCredentials: true });
        const cartItems = res.data.cart?.items || [];

        const formattedProducts = cartItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setProducts(formattedProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewProduct = (id) => navigate(`/user/product/${id}`);

  const handleCheckout = () => navigate('/user/checkout');

  const handleRemoveProduct = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/user/remove/${id}`, { withCredentials: true });
        alert("Product deleted successfully!");
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/user/update/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, quantity: newQuantity } : product
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart.");
    }
  };

  return (
     <div>
    <Navbar /> 
     <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
      padding: "30px",
    }}
  >
    <div className="cart-container">
      <h2><FaShoppingCart /> Your Cart</h2>

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="cart-grid">
          {products.length === 0 ? (
            <p className="empty-cart">No items in cart.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="cart-card">
                <img src={`http://localhost:5000/${product.thumbnail}`} alt={product.name} className="thumbnail" />
                <h3>{product.name}</h3>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Status:</strong> {product.stockStatus}</p>
                <p><strong>Available:</strong> {product.availablestock}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>

                <div className="cart-buttons">
                  <button className="view-btn" onClick={() => handleViewProduct(product._id)}>
                    <FaEye /> View
                  </button>
                  <button className="remove-btn" onClick={() => handleRemoveProduct(product._id)}>
                    
                  </button>
                </div>

                <div className="quantity-controls">
                  <button
                    disabled={product.quantity === 1}
                    onClick={() => handleUpdateQuantity(product._id, product.quantity - 1)}
                  >
                    <FaMinus />
                  </button>

                  <span>{product.quantity}</span>

                  <button
                    disabled={product.quantity >= product.availablestock}
                    onClick={() => handleUpdateQuantity(product._id, product.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {products.length > 0 && (
        <button className="checkout-btn" onClick={handleCheckout}>
          <FaCheck /> Proceed to Checkout
        </button>
      )}
    </div>
    </div>
    </div>
  );
};

export default UserCart;