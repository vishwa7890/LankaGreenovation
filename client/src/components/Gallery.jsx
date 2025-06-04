import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-modal";
import "../css/Gallery.css";

// Image Data (Include captions)
const images = [
  { src: "/contact.jfif", caption: "Award for Excellence 2023" },
  { src: "/images/achievement2.jpg", caption: "Innovative Product Launch" },
  { src: "/images/achievement3.jpg", caption: "Team Success Celebration" },
  { src: "/images/achievement4.jpg", caption: "Industry Leadership Award" },
  { src: "/images/achievement5.jpg", caption: "CSR Contribution 2024" },
  { src: "/images/achievement6.jpg", caption: "Tech Conference Speaker" },
  { src: "/images/achievement7.jpg", caption: "Employee Recognition Event" },
  { src: "/images/achievement8.jpg", caption: "Business Partnership Deal" },
  { src: "/images/achievement9.jpg", caption: "Startup of the Year" },
  { src: "/images/achievement10.jpg", caption: "Global Expansion Success" },
];

const Gallery = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Modal State
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState("");

  const openModal = (image, caption) => {
    setSelectedImage(image);
    setSelectedCaption(caption);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Slick Carousel Settings (Highlighting Center Image)
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="gallery-bg">
      <Navbar />

      <div className="container gallery-container" data-aos="fade-up">
        <h2 className="gallery-heading">Our Achievements</h2>
        <p className="gallery-description">
          A glimpse of our milestones and successes over the years.
        </p>

        {/* Image Slider */}
        <Slider {...settings} className="gallery-slider">
          {images.map((item, index) => (
            <div key={index} className="gallery-item" data-aos="zoom-in">
              <img
                src={item.src}
                alt={item.caption}
                className="gallery-image"
                onClick={() => openModal(item.src, item.caption)}
              />
              <p className="gallery-caption">{item.caption}</p>
            </div>
          ))}
        </Slider>
      </div>

      <Footer />

      {/* Lightbox Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Lightbox"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="close-button" onClick={closeModal}>
          ✖
        </button>
        <img src={selectedImage} alt="Enlarged View" className="modal-image" />
        <p className="modal-caption">{selectedCaption}</p>
      </Modal>
    </div>
  );
};

export default Gallery;
