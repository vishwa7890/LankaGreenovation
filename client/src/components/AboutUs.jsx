import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollAnimation from "../components/ScrollAnimation"; // ✅ Import custom hook
import "../css/About.css";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  useScrollAnimation(); // ✅ Call the animation hook

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        {/* Banner Section */}
        <div className="banner-container text-center fade-in-on-scroll">
          <img
            src="/Stall Facia.jpg"
            alt="Lanka Greenovation Banner"
            className="img-fluid banner-image"
          />
        </div>

        {/* Introduction Section */}
        <div className="text-center intro-text fade-in-on-scroll">
          <h2 className="fw-bold text-dark mt-4">About Lanka Greenovation</h2>
          <p>
            At <b>Lanka Greenovation</b>, we pioneer sustainable <b>biotech innovations</b>, redefining industries with <b>eco-friendly solutions</b>.
          </p>
          <p className="mt-3">
            <b>LANKA GREENOVATION LLP</b> is one of the startups supported by <b>MSME, New Delhi</b>, and incubated at <b>Kamaraj College of Engineering and Technology, Virudhunagar</b>, and <b>MABIF, Madurai</b>.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="row mt-5 align-items-center">
          <div className="col-md-6 fade-in-on-scroll">
            <div className="content-box">
              <h3 className="fw-bold">Our Mission</h3>
              <p>
                Transforming industries with <b>sustainable, science-driven solutions</b> that benefit both humans and the environment.
              </p>
            </div>
          </div>
          <div className="col-md-6 fade-in-on-scroll">
            <div className="content-box">
              <h3 className="fw-bold">Our Vision</h3>
              <p>
                Leading <b>green biotechnology</b> innovation, ensuring a balance between <b>nature and technology</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Founders */}
        <div className="mt-5 text-center fade-in-on-scroll">
          <h2 className="fw-bold">Meet Our Founders</h2>
          <p>
            Founded by visionary entrepreneur <b>Mrs. R. Ananthi</b> and <b>Dr. S. Karthikumar</b>, under the MSME mentorship of <b>Dr. R. Shyam Kumar</b>.
          </p>
        </div>

        {/* Specialization Section */}
        <div className="mt-4 text-center fade-in-on-scroll">
          <p>
            We specialize in high-quality <b>Bioproducts</b> especially <b>Algal Bioproducts, Floral Bioproducts, and Microbial Bioproducts</b>. We also design and develop customized <b>biosensor products with IoT</b> and create <b>multiplex quality parameter analyzers</b> for food and cosmetic products.
          </p>
        </div>

        {/* Services Section */}
        <div className="services mt-5 fade-in-on-scroll">
          <h2 className="text-center fw-bold">What We Offer</h2>
          <div className="row service-container">
            <div className="col-md-4 fade-in-on-scroll">
              <div className="card service-card">
                <div className="card-body text-center">
                  <h4 className="card-title">🌱 Cosmetic Bioproducts</h4>
                  <p>
                    Eco-friendly <b>skincare solutions</b> including <b>natural face masks, sunscreens, and serums</b>.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 fade-in-on-scroll">
              <div className="card service-card">
                <div className="card-body text-center">
                  <h4 className="card-title">🚜 Smart Agriculture</h4>
                  <p>
                    Using <b>IoT and AI</b> to create <b>biofertilizers</b> that improve crop yield & soil health.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 fade-in-on-scroll">
              <div className="card service-card">
                <div className="card-body text-center">
                  <h4 className="card-title">🔬 Quality Testing</h4>
                  <p>
                    Advanced <b>biochemical and microbial testing</b> ensuring <b>food safety & purity</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-5 fade-in-on-scroll">
          <a
            href="/ContactUs"
            className="get-in-touch animate__animated animate__pulse animate__infinite"
          >
            Get in Touch
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
