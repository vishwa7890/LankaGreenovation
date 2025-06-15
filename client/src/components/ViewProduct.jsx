import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/ViewProduct.css";
import { toast } from "react-toastify";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/get-product/${id}`);
        setProduct(res.data.product);
        setSelectedImg(res.data.product.images[0]);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching product");
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/products/${id}/comments`);
        setComments(res.data);
        console.log(res.data);
        
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };

    fetchProduct();
    fetchComments();
  }, [id]);

  const handleAddCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      toast.success("Product added successfully!");
      console.log(response.data.message);
    } catch (err) {
      toast.error(`Error adding product: ${err.response?.data?.message || err.message}`);
      console.error("Error adding to cart:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/user/products/${id}/comments`,
        { text: newComment, rating: newRating },
        { withCredentials: true }
      );

      setComments([res.data.comment, ...comments]); // Add new comment to top
      setNewComment("");
      setNewRating(5);
      setCommentError("");
      toast.success("Comment added successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Error adding comment";
      toast.error(message);
    }
  };

  const handleGotoCart = () => {
    navigate("/user/cart");
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f2f2f2, #e6e6e6)",
        padding: "30px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <button className="cart-btn" onClick={() => navigate("/user/productlist")}>
          ← Back to Product Listing
        </button>
      </div>

      <div className="view-product-container">
        {/* LEFT IMAGE + THUMBNAILS */}
        <div className="product-left">
          <img
            src={`http://localhost:5000/${selectedImg}`}
            alt="Selected"
            className="main-img"
          />
          <div className="thumbnail-row">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000/${img}`}
                onClick={() => setSelectedImg(img)}
                className={`thumb ${img === selectedImg ? "active" : ""}`}
                alt="thumb"
              />
            ))}
          </div>
        </div>

        {/* RIGHT PRODUCT INFO */}
        <div className="product-right">
          <div className="right-content">
            <div className="right-text">
              <h2 className="product-title">{product.name}</h2>

              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Price:</strong> <b>₹ </b>
                {product.price}
              </p>
              <p>
                <strong>Status:</strong> {product.stockStatus}
              </p>
              <p>
                <strong>Usage Summary:</strong>
              </p>
              <ul>
                {product.shortDescription.split(".").map(
                  (point, index) =>
                    point.trim() && <li key={index}>{point.trim()}.</li>
                )}
              </ul>

              <p>
                <strong>Detailed Insights:</strong>
              </p>
              <ul>
                {product.detailedDescription.split(".").map(
                  (point, index) =>
                    point.trim() && <li key={index}>{point.trim()}.</li>
                )}
              </ul>

              <div className="cart-actions">
                {product.availablestock === 0 ? (
                  <button className="outofstock-btn" disabled>
                    Out of Stock
                  </button>
                ) : (
                  <>
                    <button
                      className="cart-btn"
                      onClick={() => handleAddCart(product._id)}
                    >
                      Add to Cart
                    </button><br></br><br></br>
                    <button className="cart-btn" onClick={handleGotoCart}>
                      Go to Cart
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="right-thumbnail-preview">
              <img
                src={`http://localhost:5000/${product.thumbnail}`}
                alt={product.name}
                className="right-thumbnail-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: SPECS + TECHNICAL DETAILS */}
      <div className="specs-tech-section">
        {product.specs && (
          <div className="specs-table">
            <h3>Specifications</h3>
            <table className="product-details-table">
              <tbody>
                <tr>
                  <td>Item Form</td>
                  <td>{product.specs.itemForm}</td>
                </tr>
                <tr>
                  <td>Product Benefits</td>
                  <td>{product.specs.productBenefits}</td>
                </tr>
                <tr>
                  <td>Scent</td>
                  <td>{product.specs.scent}</td>
                </tr>
                <tr>
                  <td>Skin Type</td>
                  <td>{product.specs.skinType}</td>
                </tr>
                <tr>
                  <td>Net Quantity</td>
                  <td>{product.specs.netQuantity}</td>
                </tr>
                <tr>
                  <td>Number of Items</td>
                  <td>{product.specs.numberOfItems}</td>
                </tr>
                <tr>
                  <td>Recommended uses for product</td>
                  <td>{product.specs.recommendedUses}</td>
                </tr>
                <tr>
                  <td>UPC</td>
                  <td>{product.specs.upc}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {product.technicalDetails && (
          <div className="tech-table">
            <h3>Technical Details</h3>
            <table className="product-details-table">
              <tbody>
                <tr>
                  <td>Manufacturer</td>
                  <td>{product.technicalDetails.manufacturer}</td>
                </tr>
                <tr>
                  <td>Country of Origin</td>
                  <td>{product.technicalDetails.countryOfOrigin}</td>
                </tr>
                <tr>
                  <td>Item Part Number</td>
                  <td>{product.technicalDetails.itemPartNumber}</td>
                </tr>
                <tr>
                  <td>Product Dimensions</td>
                  <td>{product.technicalDetails.productDimensions}</td>
                </tr>
                <tr>
                  <td>ASIN</td>
                  <td>{product.technicalDetails.asin}</td>
                </tr>
                <tr>
                  <td>Best Sellers Rank</td>
                  <td>{product.additionalInfo.bestSellersRank}</td>
                </tr>
                <tr>
                  <td>Rank In FaceMasks</td>
                  <td>{product.additionalInfo.rankInFaceMasks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="comment-section">
  <h2 className="comment-title">Customer Reviews</h2>

  <form onSubmit={handleAddComment} className="comment-form">
    <textarea
      className="comment-textarea"
      placeholder="Write your review here..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      required
    />
    <div className="rating-stars-wrapper">
  <label className="rating-label">Your Rating:</label>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${newRating >= star ? "filled" : ""}`}
            onClick={() => setNewRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>

    <button type="submit" className="submit-comment-btn">
      Submit Review
    </button>
    {commentError && <p className="comment-error">{commentError}</p>}
  </form>

  <div className="comment-list">
    {comments.length === 0 ? (
      <p className="no-comments">No reviews yet. Be the first to review!</p>
    ) : (
      comments.map((comment) => (
        <div key={comment._id} className="comment-card">
          <div className="comment-header">
            <strong>{comment.user?.username || "Anonymous"}</strong>
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="comment-body">
            <div className="comment-rating">
              {"⭐".repeat(comment.rating)}{" "}
            </div>
           
            
          </div>
        </div>
      ))
    )}
  </div>
</div>
</div>
  );
};

export default ViewProduct;
