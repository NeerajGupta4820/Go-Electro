import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn Button component
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"; // shadcn icons
import Header from "../../Components/Header/Header";
import ProductSlider from "../../Components/ProductSlider/ProductSlider";
import { useGetLatestProductsQuery } from "../../redux/api/productAPI";
import Sale from "../../Components/Sale/Sale";
import UpcomingProducts from "../../Components/upcomingProducts/UpcomingProducts";
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryAPI";
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

  const { data: productData, isLoading: isProductLoading } = useGetLatestProductsQuery();
  const products = productData?.products || [];

  const { data: categoryData, isLoading: isCategoryLoading, isError: isCategoryError } = useFetchAllCategoriesQuery();
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
      if (categories.length === 0) return 0;
      return (prevIndex - 1 + categories.length) % categories.length;
    });
  }, [categories.length]);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => {
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
      <StickyCategoriesBar
        categories={categories}
        onCategoryClick={handleCategory}
        visible={showStickyBar}
      />
      <div className="categories-section bg-white p-8 text-center" ref={categoriesSectionRef}>
        {isCategoryLoading ? (
          <p>Loading categories...</p>
        ) : isCategoryError ? (
          <p>Failed to load categories. Please try again later.</p>
        ) : (
          <div className="categories-container flex items-center justify-center relative overflow-hidden">
            <Button
              variant="default"
              size="icon"
              className="category-slider-button prev rounded-full w-11 h-11"
              onClick={handlePrevClick}
              disabled={categories.length <= 6}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Button>
            <ul className="categories-list flex justify-around w-full list-none p-[45px] m-0 cursor-pointer overflow-x-auto scroll-smooth transition-transform duration-400 ease-[cubic-bezier(0.4,0.2,0.2,1)]">
              {categoriesToShow.map((category) => (
                <li key={category._id} className="m-2.5 text-center flex-[0_0_auto]">
                  <a
                    onClick={() => handleCategory(category._id)}
                    className="text-[#333] text-[1.08rem] font-medium block transition-colors hover:text-[#007bff]"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image w-20 h-20 object-cover rounded-full mb-2 transition-transform hover:scale-110 block mx-auto border-2 border-dashed border-black"
                    />
                    {window.innerWidth > 480 ? category.name : ""}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              variant="default"
              size="icon"
              className="category-slider-button next rounded-full w-11 h-11"
              onClick={handleNextClick}
              disabled={categories.length <= 6}
            >
              <ArrowRightIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      <ProductSlider
        products={products}
        title="Latest Products"
        isLoading={isProductLoading}
        link="/filter"
      />
      <Sale />
      <CategoriesProducts />

      <section className="newsletter-section max-w-full mx-auto bg-[#408de4] shadow-[0_2px_8px_rgba(35,39,47,0.07)] p-10 text-center mt-10">
        <h2 className="text-white text-[1.6rem] font-semibold font-['Inter','Roboto','Segoe_UI',Arial,sans-serif] tracking-[0.2px] mb-4">
          Subscribe to Our Newsletter
        </h2>
        <form onSubmit={handleSubscribe} className="newsletter-form flex justify-center items-center mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="newsletter-input p-2.5 border border-[#ccc] rounded-md mr-2.5 w-[250px] text-[1.08rem] font-medium font-['Inter','Roboto','Segoe_UI',Arial,sans-serif]"
          />
          <Button
            type="submit"
            className="newsletter-button px-4 py-2.5 bg-[#408de4] text-white rounded-md font-semibold text-[1.08rem] font-['Inter','Roboto','Segoe_UI',Arial,sans-serif] transition-colors hover:bg-[#3aa2b4]"
          >
            Subscribe
          </Button>
        </form>
        {message && (
          <p className="subscription-message mt-4 text-black text-[1.08rem] font-medium font-['Inter','Roboto','Segoe_UI',Arial,sans-serif]">
            {message}
          </p>
        )}
      </section>
      <UpcomingProducts />
    </div>
  );
};

export default Home;