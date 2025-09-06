import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import ProductSlider from "../../Components/ProductSlider/ProductSlider";
import { useGetLatestProductsQuery } from "../../redux/api/productAPI";
import Sale from "../../Components/Sale/Sale";
import UpcomingProducts from "../../Components/upcomingProducts/UpcomingProducts";
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryAPI";
import "./Home.css";
import CategoriesProducts from "../../Components/HomeProductComponent/CategoriesProducts";
import StickyCategoriesBar from "../../Components/Navbar/StickyCategoriesBar";

const Home = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const categoriesSectionRef = useRef(null);
  const navigate = useNavigate();

  const handleCategory = (id) => {
    navigate("/allProducts", { state: { category: id } });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!categoriesSectionRef.current) return;
      const rect = categoriesSectionRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 70); // 70px = navbar height
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: productData, isLoading: isProductLoading } =
    useGetLatestProductsQuery();
  const products = productData?.products || [];

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useFetchAllCategoriesQuery();

  const categories = categoryData?.data || [];

  // Circular infinite loop logic for category navigation
  const categoriesToShow = [];
  for (let i = 0; i < 6; i++) {
    if (categories.length > 0) {
      categoriesToShow.push(categories[(currentIndex + i) % categories.length]);
    }
  }

  const handlePrevClick = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Move left, wrap around
      if (categories.length === 0) return 0;
      return (prevIndex - 1 + categories.length) % categories.length;
    });
  }, [categories.length]);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Move right, wrap around
      if (categories.length === 0) return 0;
      return (prevIndex + 1) % categories.length;
    });
  }, [categories.length]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setMessage(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <div>
      <Header />
      {/* Sticky categories bar below navbar only when scrolled past categories-section */}
      <StickyCategoriesBar
        categories={categories}
        onCategoryClick={handleCategory}
        visible={showStickyBar}
      />
      <div className="categories-section" ref={categoriesSectionRef}>
        <h2>Shop by Categories</h2>
        {isCategoryLoading ? (
          <p>Loading categories...</p>
        ) : isCategoryError ? (
          <p>Failed to load categories. Please try again later.</p>
        ) : (
          <div className="categories-container">
            <button
              className="category-slider-button prev"
              onClick={handlePrevClick}
              disabled={categories.length <= 6}
            >
              &lt;
            </button>
            <ul className="categories-list">
              {categoriesToShow.map((category) => (
                <li key={category._id}>
                  <a onClick={() => handleCategory(category._id)}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                    {window.innerWidth > 480 ? category.name : ""}
                  </a>
                </li>
              ))}
            </ul>
            <button
              className="category-slider-button next"
              onClick={handleNextClick}
              disabled={categories.length <= 6}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Latest Products Slider */}
      <ProductSlider
        products={products}
        title="Latest Products"
        isLoading={isProductLoading}
        link="/filter"
      />
      {/* Sale Section */}
      <Sale />
      
      <CategoriesProducts/>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-button">
            Subscribe
          </button>
        </form>
        {message && <p className="subscription-message">{message}</p>}
      </section>
      <UpcomingProducts />
    </div>
  );
};

export default Home;
