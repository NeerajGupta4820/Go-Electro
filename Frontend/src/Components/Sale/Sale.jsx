import { useState } from 'react';
import img1 from "../../assets/Images/saleposters/1.jpeg";
import img2 from "../../assets/Images/saleposters/2.jpg";
import img3 from "../../assets/Images/saleposters/3.jpeg";
import img4 from "../../assets/Images/saleposters/4.jpg";
import img5 from "../../assets/Images/saleposters/5.jpg";
import img6 from "../../assets/Images/saleposters/6.jpg";
import img7 from "../../assets/Images/saleposters/7.webp";
import img8 from "../../assets/Images/saleposters/8.jpeg";
import img9 from "../../assets/Images/saleposters/9.webp";

const salesData = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Up to 50% off on all items!',
    image: img1,
    large: true,
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
  {
    id: 8,
    title: 'New Year Special',
    description: 'Kickstart the year with discounts!',
    image: img8,
    large: false,
  },
  {
    id: 9,
    title: 'New Year Special',
    description: 'Kickstart the year with discounts!',
    image: img9,
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
    <div className="py-10 px-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 font-['Inter'] tracking-tight mb-8 text-center">
        Current Sales & Offers
      </h2>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 columns-2 sm:columns-3 md:columns-4 gap-4 shadow-lg">
        {salesData.map((sale) => (
          <div
            key={sale.id}
            className={`relative cursor-pointer overflow-hidden rounded-lg mb-4 break-inside-avoid transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
              sale.large ? 'h-[450px]' : 'h-[225px]'
            }`}
            onClick={() => openModal(sale)}
          >
            <img
              src={sale.image}
              alt={sale.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-lg font-['Inter'] font-medium">
                {sale.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalSale && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white p-8 rounded-xl max-w-lg w-full relative shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              onClick={closeModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold text-gray-900 font-['Inter'] mb-4">
              {modalSale.title}
            </h2>
            <img
              src={modalSale.image}
              alt={modalSale.title}
              className="max-w-[320px] max-h-[400px] w-auto h-auto object-cover rounded-lg mx-auto mb-6"
            />
            <p className="text-gray-700 text-base font-['Inter'] mb-6">
              {modalSale.description}
            </p>
            <button
              className="px-6 py-3 bg-indigo-600 text-white font-['Inter'] font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sell;