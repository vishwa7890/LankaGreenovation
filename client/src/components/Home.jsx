import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css";
import "../css/Footer.css"; 

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-light">
      <Navbar />
      {/* Hero Section with Image Slider */}
      <section
        className="hero text-center text-white py-5 d-flex align-items-center justify-content-center position-relative "
        style={{ minHeight: "60vh", overflow: "hidden", backgroundColor: "#ededed" }}
      >
        <div id="heroCarousel" className="carousel slide w-100 h-100" data-bs-ride="carousel">
  <div className="carousel-inner">
    {["/banner1.png", "/banner2.png", "/banner3.png"].map((src, index) => (
      <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
        <img
          src={src}
          className="d-block w-100"
          alt={`Hero Image ${index + 1}`}
          style={{ width: "100%", height: "60vh", objectFit: "cover" }}
        />
      </div>
    ))}
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
  </button>
</div>


        {/* Overlay Text */}
        <div className="position-absolute top-50 start-50 translate-middle text-center" data-aos="fade-up">
          <a href="/AboutUs" className="btn btn-light text-dark mt-3">Learn More</a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="container py-5 bg-light rounded">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success" data-aos="fade-right">About Us</h2>
          <p style={{ textAlign: "justify" }}>
            Founded by visionary entrepreneur <b>Mrs. R. Ananthi</b> and co-founded by <b>Dr. S. Karthikumar</b>, we specialize in high-quality
            <b> cosmetic bioproducts, algal bioproducts, fish feed, liquid biofertilizers, and solid biofertilizers</b>.
          </p>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6" data-aos="fade-up">
            <img src="/hom.png" alt="About Us" className="img-fluid rounded-3 shadow-lg w-100" style={{ maxHeight: "300px", objectFit: "cover" }} />
          </div>
          <div className="col-md-6 d-flex flex-column align-items-start" data-aos="fade-left">
            <p className="text-muted" style={{ textAlign: "justify" }}>
              Lanka Greenovation is a pioneering biotech company dedicated to developing sustainable bioproducts for a greener future.
              We focus on eco-friendly innovations that enhance agricultural productivity, promote environmental conservation, and support the circular economy.
            </p>
            <a href="/AboutUs" className="btn btn-success mt-3">Read More</a>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-5 text-white" style={{ backgroundColor: "#2C3E50" }}>
        <div className="container text-center">
          <h2 className="fw-bold text-white" data-aos="zoom-in">Our Products</h2>
          <div className="row mt-4">
            {[
              { img: "/bio_fertilizer.png", title: "Biofertilizers", desc: "Biofertilizers boost soil fertility by enhancing microbes and nutrient uptake." },
              { img: "/cosmetic_bioproducts.png", title: "Cosmetic Bioproducts", desc: "Natural skincare solutions with herbal face masks and organic sunscreens." },
              { img: "/fish_feed.png", title: "Ornamental Fish Feed", desc: "Sustainable, high-protein fish feed enriched with essential nutrients." }
            ].map((product, index) => (
              <div className="col-md-4" data-aos="flip-up" key={index}>
                <div className="card shadow-lg">
                  <img src={product.img} className="card-img-top" alt={product.title} style={{ height: "200px", objectFit: "cover" }} />
                  <div className="card-body text-dark">
                    <h5 className="card-title fw-bold">{product.title}</h5>
                    <p className="card-text">{product.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="container py-5 bg-light rounded">
        <div className="text-center">
          <h2 className="fw-bold text-success" data-aos="fade-down">Our Services</h2>
        </div>
        <div className="row mt-4">
          <div className="col-md-6" data-aos="fade-right">
            <h4>Food Industry Services</h4>
            <ul className="list-group">
              <li className="list-group-item">✔ Raw Material Quality Testing</li>
              <li className="list-group-item">✔ Nutrient Profiling & Safety Assurance</li>
            </ul>
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <h4>Support for Startups & Students</h4>
            <ul className="list-group">
              <li className="list-group-item">✔ MSME & Startup Registration</li>
              <li className="list-group-item">✔ Intellectual Property Rights (IPR) Guidance</li>
              <li className="list-group-item">✔ Internships for Dynamic Students</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;