import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  const [message, setMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState(""); // Popup message state

  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/get-product/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          console.error("Invalid response structure:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

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

      setPopupMessage(res.data.message); // Set success message
      setTimeout(() => navigate("/productlist"), 2000);
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error updating product");
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

        {/* Popup Modal */}
        {popupMessage && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>{popupMessage}</p>
              <button onClick={() => setPopupMessage("")}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
