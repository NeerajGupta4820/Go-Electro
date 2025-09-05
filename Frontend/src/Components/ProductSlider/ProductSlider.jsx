import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loader';
import './ProductSlider.css';

const ProductSlider = ({ products, title, isLoading, link }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleNextClick();
    }, 5000); 

    return () => clearInterval(slideInterval); 
  }, [currentIndex, products]); 

  const handlePrevClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  }, [products]);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  }, [products]);

  const getProductsToShow = () => {
    const itemsToShow = window.innerWidth < 480 ? 2 : window.innerWidth < 768 ? 3 : 4;
    const end = currentIndex + itemsToShow;
    return products.slice(currentIndex, end).concat(products.slice(0, Math.max(0, end - products.length)));
  };

  return (
    <div className="product-slider">
      <h1>{title}</h1>
      {link && <Link to="allProducts" className="findmore">More</Link>}
      <main className="slider-main">
        {isLoading ? (
          <Loader type="data" />
        ) : (
          <div className="slider-container">
            <button className="slider-button prev" onClick={handlePrevClick}>
              &lt;
            </button>
            <div className="slider-track">
              {getProductsToShow().map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
            </div>
            <button className="slider-button next" onClick={handleNextClick}>
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductSlider;
