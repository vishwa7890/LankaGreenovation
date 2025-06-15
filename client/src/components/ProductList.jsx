import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ProductList.css";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/get-product", {
          withCredentials: true,
        });
        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const confirmDelete = (productId) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p>Are you sure you want to delete this product?</p>
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                const res = await axios.delete(
                  `http://localhost:5000/admin/delete-product/${productId}`,
                  { withCredentials: true }
                );
                toast.success(res.data.message || "Product deleted successfully");
                setProducts((prev) => prev.filter((p) => p._id !== productId));
              } catch (error) {
                toast.error(
                  error.response?.data?.message || "Failed to delete product"
                );
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

  const handleEdit = (id) => {
    navigate(`/editproduct/${id}`);
  };

  return (
    <div>
      <AdminNavbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
          padding: "30px",
        }}
      >
        <div className="product-list-container">
          <h2 className="product-list-header">Product List</h2>

          {loading && <p>Loading products...</p>}
          {error && <p className="product-list-error">{error}</p>}

          {!loading && !error && (
            <div className="product-list-grid">
              {products.map((product) => (
                <div key={product._id} className="product-list-card">
                  <img
                    src={`http://localhost:5000/${product.thumbnail}`}
                    alt={product.name}
                    className="product-list-thumbnail"
                  />
                  <h3 className="product-list-card-title">{product.name}</h3>
                  <p className="product-list-card-text">
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p className="product-list-card-text">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p className="product-list-card-text">
                    <strong>Status:</strong> {product.stockStatus}
                  </p>
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="product-list-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(product._id)}
                    className="product-list-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
