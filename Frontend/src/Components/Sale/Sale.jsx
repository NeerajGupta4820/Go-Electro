import  { useState } from 'react';
import './Sale.css';
import img1 from "../../assets/Images/saleposters/1.jpeg";
import img2 from "../../assets/Images/saleposters/2.jpg";
import img3 from "../../assets/Images/saleposters/3.jpeg";
import img4 from "../../assets/Images/saleposters/4.jpeg";
import img5 from "../../assets/Images/saleposters/5.jpeg";
import img6 from "../../assets/Images/saleposters/6.webp";
import img7 from "../../assets/Images/saleposters/7.webp";

const salesData = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Up to 50% off on all items!',
    image: img1,
    large: true,  // large image
  },
  {
    id: 2,
    title: 'Winter Clearance',
    description: 'Up to 70% off on selected products!',
    image: img2,
    large: false,
  },
  {
    id: 3,
    title: 'Back to School Sale',
    description: 'Save 20% on school supplies!',
    image: img3,
    large: true,
  },
  {
    id: 4,
    title: 'Flash Deal',
    description: 'Limited time offer: 40% off!',
    image: img4,
    large: false,
  },
  {
    id: 5,
    title: 'Black Friday Deal',
    description: 'Crazy deals for 24 hours!',
    image: img5,
    large: false,
  },
  {
    id: 6,
    title: 'Holiday Sale',
    description: 'Up to 30% off on gifts!',
    image: img6,
    large: true,
  },
  {
    id: 7,
    title: 'New Year Special',
    description: 'Kickstart the year with discounts!',
    image: img7,
    large: false,
  },
];

const Sell = () => {
  const [modalSale, setModalSale] = useState(null);

  const openModal = (sale) => {
    setModalSale(sale);
  };

  const closeModal = () => {
    setModalSale(null);
  };

  return (
    <div className="sell-container">
      <h2>Current Sales and Offers</h2>
      <div className="collage-grid">
        {salesData.map((sale) => (
          <div
            key={sale.id}
            className={`sale-item ${sale.large ? 'large' : 'small'}`}
            onClick={() => openModal(sale)}
          >
            <img src={sale.image} alt={sale.title} className="sale-image" />
          </div>
        ))}
      </div>

      {modalSale && (
        <div className="sale-modal-overlay" onClick={closeModal}>
          <div className="sale-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{modalSale.title}</h2>
            <img src={modalSale.image} alt={modalSale.name} className="sale-modal-image-small" />
            <p>{modalSale.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell;
