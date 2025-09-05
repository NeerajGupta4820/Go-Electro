import { useGetAllProductsQuery } from '../../redux/api/productAPI.js';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import "./CategoriesProduct.css";

const Earphone = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllProductsQuery();
  
  const colors = ["#4dbdd6", "#28a745", "#ffc107", "#dc3545"];
  const [buttonColors, setButtonColors] = useState({});
  const [addedProducts, setAddedProducts] = useState({});

  if (isLoading) return <p>Loading...</p>;
  if (!data || !Array.isArray(data.products)) return <p>No products available</p>;

  const products = data.products;
  const categoriesToDisplay = ['earphone', 'bluetoothspeaker', 'powerbank'];

  const handleAddToCart = (productId, product) => {
    // Randomize color for this product
    const randomColor = colors[(Math.random() * colors.length) | 0];

    // Update button color for this specific product
    setButtonColors(prevState => ({
      ...prevState,
      [productId]: randomColor
    }));

    // Add the product to the cart
    dispatch(
      addToCart({
        productId: product._id,
        price: product.price,
        quantity: 1,
        name: product.title,
        images: product.images,
      })
    );

    // Show success toast
    toast.success("Added to Cart", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      theme: "dark",
    });

    // Mark product as added
    setAddedProducts(prevState => ({
      ...prevState,
      [productId]: true
    }));

    // Reset the button color and added state after 1.5 seconds
    setTimeout(() => {
      setButtonColors(prevState => ({
        ...prevState,
        [productId]: "#rgb(247, 139, 90)" // Reset to default color
      }));
      setAddedProducts(prevState => ({
        ...prevState,
        [productId]: false
      }));
    }, 1500);
  };

  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="main-cateory-proudcts-container categories-main-wide">
      <h1 className="categories-heading-sale">Shop by Category</h1>
      {categoriesToDisplay.map(categorySlug => {
        const filteredProducts = products.filter(product => product.category.slug === categorySlug);
        if (filteredProducts.length === 0) return null;

        return (
          <div key={categorySlug} className="category-section-block">
            <h2 className="category-section-title-sale">{categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}</h2>
            {filteredProducts.length < 4 ? (
              <div className="category-products">
                {filteredProducts.map(product => (
                  <div key={product._id} className="categorieswise-product-card categories-card-vibrant">
                    <h3>{product.title}</h3>
                    {product.images.length > 0 && (
                      <img 
                        src={product.images[0].imageLinks[0]} 
                        alt={product.title} 
                        onClick={() => handleImageClick(product._id)}
                        className="category-product-image"
                      />
                    )}
                    <p className="category-card-price">₹{product.price}</p>
                    <p className="category-card-rating">Rating: {product.ratings} / 5</p>
                    <button 
                      className="category-product-button" 
                      onClick={() => handleAddToCart(product._id, product)} 
                      style={{ backgroundColor: buttonColors[product._id] || "#23272f" }}
                    >
                      <FaShoppingCart className={`cart-icon ${addedProducts[product._id] ? "move" : ""}`} />
                      {addedProducts[product._id] ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
        <div
          className="category-products-slider"
                onMouseDown={e => {
                  const slider = e.currentTarget;
                  slider.isDown = true;
                  slider.startX = e.pageX - slider.offsetLeft;
                  slider.scrollLeftStart = slider.scrollLeft;
                  slider.classList.add('active');
                }}
                onMouseLeave={e => {
                  const slider = e.currentTarget;
                  slider.isDown = false;
                  slider.classList.remove('active');
                }}
                onMouseUp={e => {
                  const slider = e.currentTarget;
                  slider.isDown = false;
                  slider.classList.remove('active');
                }}
                onMouseMove={e => {
                  const slider = e.currentTarget;
                  if (!slider.isDown) return;
                  e.preventDefault();
                  const x = e.pageX - slider.offsetLeft;
                  const walk = (x - slider.startX) * 1.2;
                  slider.scrollLeft = slider.scrollLeftStart - walk;
                }}
                onTouchStart={e => {
                  const slider = e.currentTarget;
                  slider.isDown = true;
                  slider.startX = e.touches[0].pageX - slider.offsetLeft;
                  slider.scrollLeftStart = slider.scrollLeft;
                }}
                onTouchEnd={e => {
                  const slider = e.currentTarget;
                  slider.isDown = false;
                }}
                onTouchMove={e => {
                  const slider = e.currentTarget;
                  if (!slider.isDown) return;
                  const x = e.touches[0].pageX - slider.offsetLeft;
                  const walk = (x - slider.startX) * 1.2;
                  slider.scrollLeft = slider.scrollLeftStart - walk;
                }}
              >
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="categorieswise-product-card categories-card-vibrant slider-card"
                  >
                    <h3>{product.title}</h3>
                    {product.images.length > 0 && (
                      <img 
                        src={product.images[0].imageLinks[0]} 
                        alt={product.title} 
                        onClick={() => handleImageClick(product._id)}
                        className="category-product-image"
                      />
                    )}
                    <p className="category-card-price">₹{product.price}</p>
                    <p className="category-card-rating">Rating: {product.ratings} / 5</p>
                    <button 
                      className="category-product-button" 
                      onClick={() => handleAddToCart(product._id, product)} 
                      style={{ backgroundColor: buttonColors[product._id] || "#23272f" }}
                    >
                      <FaShoppingCart className={`cart-icon ${addedProducts[product._id] ? "move" : ""}`} />
                      {addedProducts[product._id] ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Earphone;
