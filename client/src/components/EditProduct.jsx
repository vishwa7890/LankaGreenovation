import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    shortDescription: "",
    detailedDescription: "",
    stockStatus: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/get-product/${id}`,
          { withCredentials: true }
        );

        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          toast.error("Product data not found.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error("Unauthorized. Please login as admin.");
          navigate("/admin/login");
        } else {
          console.error("Error fetching product:", err);
          toast.error("Error fetching product.");
        }
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/edit-product/${id}`,
        product,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Product updated successfully!");
      setTimeout(() => navigate("/productlist"), 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized. Please login as admin.");
        navigate("/admin/login");
      } else {
        console.error("Error updating product:", err);
        toast.error(err.response?.data?.message || "Error updating product.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "30px",
      }}
    >
      <div className="edit-product-container">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            placeholder="Brand"
            required
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <textarea
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleChange}
            placeholder="Short Description"
            required
          />
          <textarea
            name="detailedDescription"
            value={product.detailedDescription}
            onChange={handleChange}
            placeholder="Detailed Description"
            required
          />
          <select
            name="stockStatus"
            value={product.stockStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button type="submit">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
