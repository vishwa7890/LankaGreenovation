import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/UserProducts.css';
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import LoadingSpinner from "../components/LoadingSpinner";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState("default");

  const [currentPageCosmetics, setCurrentPageCosmetics] = useState(1);
  const [currentPageFood, setCurrentPageFood] = useState(1);

  const itemsPerPage = 6;
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
      await axios.post(
        "http://localhost:5000/user/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleViewProduct = (id) => {
    navigate(`/user/product/${id}`);
  };

  const renderProductCard = (product) => (
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
        {product.stockStatus === "In Stock" ? (
          <>
            <button className="user-add-btn" onClick={() => handleAddCart(product._id)}>Add to Cart</button>
            <button className="user-view-btn" onClick={() => handleViewProduct(product._id)}>View Product</button>
          </>
        ) : (
          <>
            <button className="user-out-btn" disabled>Out of Stock</button>
            <button className="user-view-btn" onClick={() => handleViewProduct(product._id)}>View Product</button>
          </>
        )}
      </div>
    </div>
  );

  const sortProducts = (products) => {
    if (sortOrder === "lowToHigh") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    return products;
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cosmetics
  const filteredCosmetics = filteredProducts.filter(p => p.category === "Cosmetics");
  const sortedCosmetics = sortProducts(filteredCosmetics);
  const totalPagesCosmetics = Math.ceil(sortedCosmetics.length / itemsPerPage);
  const displayedCosmetics = sortedCosmetics.slice(
    (currentPageCosmetics - 1) * itemsPerPage,
    currentPageCosmetics * itemsPerPage
  );

  // Food Products
  const filteredFood = filteredProducts.filter(p => p.category === "Food Product");
  const sortedFood = sortProducts(filteredFood);
  const totalPagesFood = Math.ceil(sortedFood.length / itemsPerPage);
  const displayedFood = sortedFood.slice(
    (currentPageFood - 1) * itemsPerPage,
    currentPageFood * itemsPerPage
  );

  const renderPagination = (currentPage, totalPages, setPage) => (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={currentPage === i + 1 ? "active-page" : ""}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <Navbar />

      {/* Hero Video */}
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/serum.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <div className="user-products-container">
        <h2 className="user-products-title">Our Products</h2>

        {/* Search Bar */}
        <div className="user-search-bar">
          <input
            type="text"
            placeholder="Search by product name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Sort Bar */}
        <div className="sort-bar">
          <label htmlFor="sortOrder">Sort by Price: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPageCosmetics(1);
              setCurrentPageFood(1);
            }}
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        {loading && <p className="user-products-loading">Loading products...</p>}
        {error && <p className="user-products-error">{error}</p>}

        {!loading && !error && (
          <>
            {/* Food Products */}
            <div className="user-product-section">
              <h3 className="section-heading"><span className="section-icon">🍽️</span> Food Products</h3>
              {sortedFood.length === 0 ? (
                <p>No Food Products Available</p>
              ) : (
                <>
                  <div className="user-product-grid">
                    {displayedFood.map(renderProductCard)}
                  </div>
                  {sortedFood.length > 6 &&
                    renderPagination(currentPageFood, totalPagesFood, setCurrentPageFood)}
                </>
              )}
            </div>

            {/* Swiper */}
            <section className="hero" style={{ minHeight: "60vh", backgroundColor: "#ededed", margin: "40px 0" }}>
              <div className="container-fluid p-0">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                >
                  <SwiperSlide>
                    <img className="d-block w-100 hero-img" src="/banner1.png" alt="Slide 1" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img className="d-block w-100 hero-img" src="/banner2.png" alt="Slide 2" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img className="d-block w-100 hero-img" src="/banner3.png" alt="Slide 3" />
                  </SwiperSlide>
                </Swiper>
              </div>
            </section>

            {/* Cosmetics */}
            <div className="user-product-section">
              <h3 className="section-heading"><span className="section-icon">💄</span> Cosmetics</h3>
              {sortedCosmetics.length === 0 ? (
                <p>No Cosmetics Available</p>
              ) : (
                <>
                  <div className="user-product-grid">
                    {displayedCosmetics.map(renderProductCard)}
                  </div>
                  {sortedCosmetics.length > 6 &&
                    renderPagination(currentPageCosmetics, totalPagesCosmetics, setCurrentPageCosmetics)}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProducts;
