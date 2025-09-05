import  { useState } from 'react';
import './UpcomingProducts.css'; 
import img1 from "../../assets/Images/upcoming-products/1.avif";
import img2 from "../../assets/Images/upcoming-products/2.jpeg";
import img3 from "../../assets/Images/upcoming-products/3.avif";
import img4 from "../../assets/Images/upcoming-products/4.webp";
import img5 from "../../assets/Images/upcoming-products/5.jpg";
import img6 from "../../assets/Images/upcoming-products/6.jpeg";

const productsData = [
  { id: 1, name: 'Product 1', image: img1, description: 'This is the description for Product 1', price: '₹1,000' },
  { id: 2, name: 'Product 2', image: img2, description: 'This is the description for Product 2', price: '₹2,000' },
  { id: 3, name: 'Product 3', image: img3, description: 'This is the description for Product 3', price: '₹3,000' },
  { id: 4, name: 'Product 4', image: img4, description: 'This is the description for Product 4', price: '₹4,000' },
  { id: 5, name: 'Product 5', image: img5, description: 'This is the description for Product 5', price: '₹5,000' },
  { id: 6, name: 'Product 6', image: img6, description: 'This is the description for Product 6', price: '₹6,000' },
];

const UpcomingProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className='main-upcomingProducts'>
      <h2>Newly Launched Products</h2>
      <div className="product-collage">
        {productsData.map((product) => (
          <img
            key={product.id}
            src={product.image}
            alt={product.name}
            className="product-image"
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>
      {selectedProduct && (
        <div className="upcoming-modal" onClick={closeModal}>
          <div className="upcoming-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="upcoming-modal-image-small" />
            <p>{selectedProduct.description}</p>
            <p><strong>Price:</strong> {selectedProduct.price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingProducts;
