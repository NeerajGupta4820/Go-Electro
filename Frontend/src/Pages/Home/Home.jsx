import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button"; // shadcn Button component
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Mail } from "lucide-react";
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

      <section className="newsletter-section max-w-full mx-auto py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-lg p-3 text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">Subscribe to our newsletter</h2>
                <p className="text-sm text-muted-foreground mt-1">Get the latest products, offers and updates right in your inbox.</p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-3 items-center">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                required
                className="min-w-0 w-full md:w-72"
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </Card>
          {message && (
            <p className="mt-4 text-sm text-foreground font-medium text-center md:text-left">{message}</p>
          )}
        </div>
      </section>
      <UpcomingProducts />
    </div>
  );
};

export default Home;