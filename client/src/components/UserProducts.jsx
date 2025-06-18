import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/UserProducts.css';
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProducts = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/get-product");
        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const handleAddCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/add",
        { productId, quantity: 1 }, 
        { withCredentials: true }
      );
      toast.success("Product added to cart!");
      console.log(response.data.message);
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
      console.error("Error adding to cart:", err);
    }
  };

  const handleViewProduct = (id) => {
    navigate(`/user/product/${id}`);
  }

  return (
    <div>
      <Navbar /> 
        {/* Hero Section with Video */}
        <section className="hero-section">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/serum.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
          padding: "30px",
        }}
      >
        <div className="user-products-container">
          <h2 className="user-products-title">Our Products</h2>

          {loading && <p className="user-products-loading">Loading products...</p>}
          {error && <p className="user-products-error">{error}</p>}

          {!loading && !error && (
            <div className="user-product-grid">
              {products.map((product) => (
                <div key={product._id} className="user-product-card">
                  <img
                    src={`http://localhost:5000/${product.thumbnail}`}
                    alt={product.name}
                    className="user-product-thumbnail"
                  />
                  <h3 className="user-product-name">{product.name}</h3>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Price:</strong> ₹{product.price}</p>
                  <p><strong>Status:</strong> {product.stockStatus}</p>

                  <div className="user-product-buttons">
                    <button className="user-add-btn" onClick={() => handleAddCart(product._id)}>
                      Add to Cart
                    </button>
                    <button className="user-view-btn" onClick={() => handleViewProduct(product._id)}>
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProducts;
