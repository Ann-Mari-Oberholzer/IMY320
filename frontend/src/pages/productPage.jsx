import React, { useState } from "react";
import { FaStar, FaHeart,FaShoppingCart } from "react-icons/fa";
import NavBar from "../components/NavBar";
import {
  container,
  big,
  card,
  imageSection,
  bigImage,
  thumbnailRow,
  thumbnail,
  details,
  title,
  price,
  description,
  specs,
  rating,
  categories,
  button,
  wishlistButton,
  buttonHover,
  category,
  ratingContainer,
  starStyle,
  ratingStyle,
} from "./productStyles";

// Sample product
const sampleProduct = {
  title: "Razer BlackShark V2 Pro Wireless Gaming Headset",
  price: 3499,
  images: [
    "https://assets.razerzone.com/razer-blackshark.jpg",
    "https://assets.razerzone.com/razer-blackshark2.jpg",
    "https://assets.razerzone.com/razer-blackshark3.jpg",
  ],
  description:
    "A high-performance wireless gaming headset with THX Spatial Audio, advanced passive noise cancellation, and a detachable mic.",
  specs: [
    "Wireless 2.4GHz connection",
    "50mm drivers with THX Spatial Audio",
    "Up to 24 hours battery life",
    "Detachable HyperClear Cardioid Mic",
  ],
  rating: 4.5,
  categories: ["Gaming", "Headset", "Wireless"],
};

function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(sampleProduct.images[0]);

  return (
    <div style={big}>
      <NavBar currentPage="product" />
      <div style={container}>
        <div style={card}>
          {/* Left: Image Section */}
          <div style={imageSection}>
            <img
              src={selectedImage}
              alt={sampleProduct.title}
              style={bigImage}
            />
            <div style={thumbnailRow}>
              {sampleProduct.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  style={{
                    ...thumbnail,
                    border:
                      img === selectedImage ? "2px solid #00AEBB" : "none",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div style={details}>
            <h3 style={title}>{sampleProduct.title}</h3>
            <p style={description}>{sampleProduct.description}</p>
            <div style={categories}>
              {sampleProduct.categories.map((cat, index) => (
                <span key={index} style={category}>{cat}</span>
              ))}
            </div>
            <div style={ratingContainer}>
              <FaStar style={starStyle} />
              <span style={ratingStyle}>{sampleProduct.rating}</span>
            </div>

            <p style={price}>R {sampleProduct.price}</p>
            <div style={specs}>
              <h3>Specifications:</h3>
              <ul>
                {sampleProduct.specs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...button, flex: 7 }}
              >
                <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                Add to Cart
              </button>
              <button style={{ ...wishlistButton, flex: 3 }}>
                <FaHeart />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;