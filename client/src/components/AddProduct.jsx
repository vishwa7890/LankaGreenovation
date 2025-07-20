import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AddProduct.css";
import AdminNavbar from "../components/AdminNavbar";
import LoadingSpinner from "../components/LoadingSpinner";
const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        price: "",
        shortDescription: "",
        detailedDescription: "",
        stockStatus: "In Stock",
        availablestock: 0,
        category: "", // <-- added
        itemForm: "",
        productBenefits: "",
        scent: "",
        skinType: "",
        netQuantity: "",
        numberOfItems: "",
        recommendedUses: "",
        upc: "",
        manufacturer: "",
        countryOfOrigin: "",
        itemPartNumber: "",
        productDimensions: "",
        asin: "",
        itemWeight: "",
        itemDimensions: "",
        bestSellersRank: "",
        rankInFaceMasks: "",
        dateFirstAvailable: ""
    });
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState("");
    const [fadeIn, setFadeIn] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "availablestock" || name === "numberOfItems" ? Number(value) : value,
        }));
    };

    const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 2MB

    const oversized = selectedFiles.find(file => file.size > maxSize);
    if (oversized) {
        setMessage("One or more files are too large (max 2MB per image).");
        setPopupType("error");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
    }

    if (selectedFiles.length + images.length > 5) {
        setMessage("You can only upload up to 5 images.");
        setPopupType("error");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
    }

    setImages([...images, ...selectedFiles]);
};

    const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; 

    if (file && file.size > maxSize) {
        setMessage("Thumbnail file is too large (max 2MB).");
        setPopupType("error");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
    }

    setThumbnail(file);
};


    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });

        images.forEach((img) => formData.append("images", img));
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            const res = await axios.post("http://localhost:5000/admin/add-product", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(res.data.message);
            setPopupType("success");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);

            setProduct({
                name: "",
                brand: "",
                price: "",
                shortDescription: "",
                detailedDescription: "",
                stockStatus: "In Stock",
                availablestock: 0, // fixed here
                category: "",
                itemForm: "",
                productBenefits: "",
                scent: "",
                skinType: "",
                netQuantity: "",
                numberOfItems: "",
                recommendedUses: "",
                upc: "",
                manufacturer: "",
                countryOfOrigin: "",
                itemPartNumber: "",
                productDimensions: "",
                asin: "",
                itemWeight: "",
                itemDimensions: "",
                bestSellersRank: "",
                rankInFaceMasks: "",
                dateFirstAvailable: ""
            });
            setImages([]);
            setThumbnail(null);
        }  catch (err) {
    setMessage(err.response?.data?.error || "Failed to add product");
    setPopupType("error");
    setShowPopup(true);
  } finally {
    setLoading(false); // Stop loading
    setTimeout(() => setShowPopup(false), 3000);
  }
    };

    const fields = [
        { label: "Product Name", name: "name" },
        { label: "Brand", name: "brand" },
        { label: "Price", name: "price", type: "number" },
        { label: "Stock", name: "availablestock", type: "number" },
        { label: "Short Description", name: "shortDescription", textarea: true },
        { label: "Detailed Description", name: "detailedDescription", textarea: true },
        { label: "Category", name: "category", select: true, options: ["Food Product", "Cosmetics","Biofertilizers"] },
        { label: "Item Form", name: "itemForm" },
        { label: "Product Benefits", name: "productBenefits" },
        { label: "Scent", name: "scent" },
        { label: "Skin Type", name: "skinType" },
        { label: "Net Quantity", name: "netQuantity" },
        { label: "Number of Items", name: "numberOfItems", type: "number" },
        { label: "Recommended Uses", name: "recommendedUses" },
        { label: "UPC", name: "upc" },
        { label: "Manufacturer", name: "manufacturer" },
        { label: "Country of Origin", name: "countryOfOrigin" },
        { label: "Item Part Number", name: "itemPartNumber" },
        { label: "Product Dimensions", name: "productDimensions" },
        { label: "ASIN", name: "asin" },
        { label: "Item Weight", name: "itemWeight" },
        { label: "Item Dimensions", name: "itemDimensions" },
        { label: "Best Sellers Rank", name: "bestSellersRank" },
        { label: "Rank in Face Masks", name: "rankInFaceMasks" }
    ];

    return (
        <div>
            <AdminNavbar />
            {loading && (
  <div className="loading-overlay">
    <LoadingSpinner />
  </div>
)}

            <div className="add-product-wrapper">
                {showPopup && (
                    <div className={`popup-message ${popupType}`}>
                        {message}
                    </div>
                )}

                <div className={`add-product-container ${fadeIn ? "fade-in" : ""}`}>
                    <h2 className="add-product-title">Add Product</h2>

                    <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
                        {fields.map(({ label, name, textarea, select, options = [], type = "text" }) => (
                            <div className="form-group" key={name}>
                                <label className="form-label">{label}</label>
                                {select ? (
                                    <select
                                        name={name}
                                        className="form-select"
                                        value={product[name]}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select {label}</option>
                                        {options.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : textarea ? (
                                    <textarea name={name} className="form-input" value={product[name]} onChange={handleInputChange} />
                                ) : (
                                    <input type={type} name={name} className="form-input" value={product[name]} onChange={handleInputChange} />
                                )}
                            </div>
                        ))}

                        <div className="form-group">
                            <label className="form-label">Stock Status</label>
                            <select
                                name="stockStatus"
                                className="form-select"
                                value={product.stockStatus}
                                onChange={handleInputChange}
                            >
                                <option value="In Stock">In Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Limited Stock">Limited Stock</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Thumbnail Image</label>
                            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                            {thumbnail && (
                                <div className="file-preview" style={{ maxWidth: "100px", marginTop: "10px" }}>
                                    <div className="file-preview-item" style={{ position: "relative" }}>
                                        <img
                                            src={URL.createObjectURL(thumbnail)}
                                            alt="Thumbnail Preview"
                                            style={{ height: "80px", width: "80px", objectFit: "cover", borderRadius: "6px" }}
                                        />
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => setThumbnail(null)}
                                            aria-label="Remove thumbnail"
                                        ></button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Images (Max: 5)</label>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                            {images.length > 0 && (
                                <div className="file-preview">
                                    {images.map((img, index) => (
                                        <div key={index} className="file-preview-item">
                                            <img src={URL.createObjectURL(img)} alt="Preview" />
                                            <button type="button" className="remove-btn" onClick={() => removeImage(index)}></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="submit-button">Add Product</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
