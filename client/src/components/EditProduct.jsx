import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../css/EditProduct.css";
import AdminNavbar from "../components/AdminNavbar";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    name: "", brand: "", price: "", availablestock: "",
    shortDescription: "", detailedDescription: "", stockStatus: "",
    category: "", // <-- added
    itemForm: "", productBenefits: "", scent: "", skinType: "",
    netQuantity: "", numberOfItems: "", recommendedUses: "", upc: "",
    manufacturer: "", countryOfOrigin: "", itemPartNumber: "",
    productDimensions: "", asin: "", itemWeight: "", itemDimensions: "",
    bestSellersRank: "", rankInFaceMasks: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/admin/get-product/${id}`, { withCredentials: true });
        if (res.data?.product) {
          const p = res.data.product;
          setProduct({
            name: p.name || "", brand: p.brand || "", price: p.price || "", availablestock: p.availablestock || "",
            shortDescription: p.shortDescription || "", detailedDescription: p.detailedDescription || "", stockStatus: p.stockStatus || "",
            category: p.category || "", // <-- handle fetched category
            itemForm: p.specs?.itemForm || "", productBenefits: p.specs?.productBenefits || "", scent: p.specs?.scent || "", skinType: p.specs?.skinType || "",
            netQuantity: p.specs?.netQuantity || "", numberOfItems: p.specs?.numberOfItems || "", recommendedUses: p.specs?.recommendedUses || "", upc: p.specs?.upc || "",
            manufacturer: p.technicalDetails?.manufacturer || "", countryOfOrigin: p.technicalDetails?.countryOfOrigin || "", itemPartNumber: p.technicalDetails?.itemPartNumber || "",
            productDimensions: p.technicalDetails?.productDimensions || "", asin: p.technicalDetails?.asin || "",
            itemWeight: p.additionalInfo?.itemWeight || "", itemDimensions: p.additionalInfo?.itemDimensions || "",
            bestSellersRank: p.additionalInfo?.bestSellersRank || "", rankInFaceMasks: p.additionalInfo?.rankInFaceMasks || ""
          });
        } else toast.error("Product not found");
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Unauthorized. Please login.");
          navigate("/admin/login");
        } else {
          toast.error("Error fetching product.");
        }
      }finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedImages.map(file => URL.createObjectURL(file)));
  };

  const handleBack = () => {
    navigate("/productlist");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => formData.append(key, value));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.put(`http://localhost:5000/admin/edit-product/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(res.data.message || "Product updated!");
      setTimeout(() => navigate("/productlist"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating product.");
    }finally {
      setLoading(false);
    }
  };

  return (
     <div>
      <AdminNavbar />
      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
    <div style={{ minHeight: "100vh", background: "#f9f9f9", padding: "30px" }}>
      <div className="edit-product-container">
        <div className="edit-header">
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft style={{ marginRight: "5px" }} /> Back
          </button>
          <h2>Edit Product</h2>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" required />
          <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" required />
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required />
          <input type="number" name="availablestock" value={product.availablestock} onChange={handleChange} placeholder="Available Stock" required />
          <textarea name="shortDescription" value={product.shortDescription} onChange={handleChange} placeholder="Short Description" required />
          <textarea name="detailedDescription" value={product.detailedDescription} onChange={handleChange} placeholder="Detailed Description" required />

          <select name="stockStatus" value={product.stockStatus} onChange={handleChange} required>
            <option value="">Select Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited Stock">Limited Stock</option>
          </select>

          {/* ✅ Category Field */}
          <select name="category" value={product.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Food Product">Food Product</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Biofertilizers">Biofertilizers</option>
          </select>

          {/* Specs */}
          <input name="itemForm" value={product.itemForm} onChange={handleChange} placeholder="Item Form" />
          <input name="productBenefits" value={product.productBenefits} onChange={handleChange} placeholder="Product Benefits" />
          <input name="scent" value={product.scent} onChange={handleChange} placeholder="Scent" />
          <input name="skinType" value={product.skinType} onChange={handleChange} placeholder="Skin Type" />
          <input name="netQuantity" value={product.netQuantity} onChange={handleChange} placeholder="Net Quantity" />
          <input name="numberOfItems" value={product.numberOfItems} onChange={handleChange} placeholder="Number of Items" />
          <input name="recommendedUses" value={product.recommendedUses} onChange={handleChange} placeholder="Recommended Uses" />
          <input name="upc" value={product.upc} onChange={handleChange} placeholder="UPC" />

          {/* Technical */}
          <input name="manufacturer" value={product.manufacturer} onChange={handleChange} placeholder="Manufacturer" />
          <input name="countryOfOrigin" value={product.countryOfOrigin} onChange={handleChange} placeholder="Country of Origin" />
          <input name="itemPartNumber" value={product.itemPartNumber} onChange={handleChange} placeholder="Item Part Number" />
          <input name="productDimensions" value={product.productDimensions} onChange={handleChange} placeholder="Product Dimensions" />
          <input name="asin" value={product.asin} onChange={handleChange} placeholder="ASIN" />

          {/* Additional */}
          <input name="itemWeight" value={product.itemWeight} onChange={handleChange} placeholder="Item Weight" />
          <input name="itemDimensions" value={product.itemDimensions} onChange={handleChange} placeholder="Item Dimensions" />
          <input name="bestSellersRank" value={product.bestSellersRank} onChange={handleChange} placeholder="Best Sellers Rank" />
          <input name="rankInFaceMasks" value={product.rankInFaceMasks} onChange={handleChange} placeholder="Rank In Face Masks" />

          {/* Thumbnail Upload */}
          <input type="file" name="thumbnail" onChange={handleThumbnailChange} />
          {thumbnail && (
            <div className="file-preview">
              <div className="file-preview-item">
                <img src={thumbnailPreview} alt="Thumbnail" />
                <button type="button" className="remove-btn" onClick={() => setThumbnail(null)}></button>
              </div>
            </div>
          )}

          {/* Multiple Images Upload */}
          <input type="file" name="images" multiple onChange={handleImagesChange} />
          {imagePreviews.length > 0 && (
            <div className="file-preview">
              {imagePreviews.map((src, index) => (
                <div key={index} className="file-preview-item">
                  <img src={src} alt="Preview" />
                  <button type="button" className="remove-btn" onClick={() => removeImage(index)}></button>
                </div>
              ))}
            </div>
          )}

          <button type="submit">Update Product</button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default EditProduct;
