import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Home.css";
import "../css/Footer.css"; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-light">
      <Navbar />
      <section className="hero" style={{ minHeight: "60vh", backgroundColor: "#ededed" }}>
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
            <img className="d-block w-100 hero-img" src="banner1.png" alt="Slide 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img className="d-block w-100 hero-img" src="banner2.png" alt="Slide 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img className="d-block w-100 hero-img" src="banner3.png" alt="Slide 3" />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>


      {/* About Us Section */}
      <section id="about" className="container py-5 bg-light rounded">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success" data-aos="fade-right">About Us</h2>
          <p  className="text-muted" style={{ textAlign: "justify" }}>
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
              <a
          href="https://wa.me/919095084840"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp whatsapp-icon"></i>
        </a>
      <Footer />
    </div>
  );
};

export default Home;