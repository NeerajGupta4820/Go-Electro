import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryAPI";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { FaStar } from "react-icons/fa";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState(null);
  const [dateSortOption, setDateSortOption] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 779);

  const { data: products, error, isLoading } = useGetAllProductsQuery();
  const { data: categoryData } = useFetchAllCategoriesQuery();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 779);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (products && query) {
      const searchTerm = query.toLowerCase().trim();
      const filtered = products.products.filter((product) => {
        const productName = product.name?.toLowerCase() || "";
        const productDescription = product.description?.toLowerCase() || "";
        const productBrand = product.brand?.toLowerCase() || "";
        const productCategory = product.category?.name?.toLowerCase() || "";

        return (
          productName.includes(searchTerm) ||
          productDescription.includes(searchTerm) ||
          productBrand.includes(searchTerm) ||
          productCategory.includes(searchTerm)
        );
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [products, query]);

  const applyFilters = () => {
    if (!products || !query) return;

    const searchTerm = query.toLowerCase().trim();
    let updatedProducts = products.products.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const productDescription = product.description?.toLowerCase() || "";
      const productBrand = product.brand?.toLowerCase() || "";
      const productCategory = product.category?.name?.toLowerCase() || "";

      return (
        productName.includes(searchTerm) ||
        productDescription.includes(searchTerm) ||
        productBrand.includes(searchTerm) ||
        productCategory.includes(searchTerm)
      );
    });

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((item) =>
        selectedCategories.includes(item.category._id)
      );
    }

    updatedProducts = updatedProducts.filter(
      (item) =>
        item.price >= filters.priceRange[0] &&
        item.price <= filters.priceRange[1]
    );

    if (filters.brands.length > 0) {
      updatedProducts = updatedProducts.filter((item) =>
        filters.brands.includes(item.brand)
      );
    }

    if (filters.rating > 0) {
      updatedProducts = updatedProducts.filter(
        (item) => item.ratings >= filters.rating
      );
    }

    if (priceSortOption === "priceLowToHigh") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    } else if (priceSortOption === "priceHighToLow") {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    }

    if (dateSortOption === "newest") {
      updatedProducts = updatedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (dateSortOption === "oldest") {
      updatedProducts = updatedProducts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, selectedCategories, products, query, priceSortOption, dateSortOption]);

  if (isLoading) {
    return <div className="search-loading">Loading...</div>;
  }

  if (error) {
    return <div className="search-error">Error: {error.message}</div>;
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleStarChange = (rating) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      rating: prevFilters.rating === rating ? 0 : rating,
    }));
  };

  const handleBrandChange = (brand) => {
    setFilters((prevFilters) => {
      const isBrandSelected = prevFilters.brands.includes(brand);
      const updatedBrands = isBrandSelected
        ? prevFilters.brands.filter((b) => b !== brand)
        : [...prevFilters.brands, brand];

      return {
        ...prevFilters,
        brands: updatedBrands,
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      brands: [],
      rating: 0,
    });
    setSelectedCategories([]);
    setPriceSortOption(null);
    setDateSortOption(null);
    setCurrentPage(1);
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const handlePriceRangeChange = (values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: values,
    }));
  };

  const brands = [...new Set(filteredProducts.map((item) => item.brand))];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Search Results</h1>
        <p>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found for "{query}"
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h2>No products found</h2>
          <p>Try searching with different keywords or browse all products.</p>
        </div>
      ) : (
        <>
          <div className="top-bar">
            <button className="filter-button" onClick={toggleFilterPopup}>
              Sorting
            </button>
            <button className="reset-button" onClick={resetFilters}>
              Reset
            </button>
          </div>
          
          <div className="layout">
            <div className="search-sidebar">
              {isSmallScreen ? (
                <>
                  <div className="category-section">
                    <h3>Categories</h3>
                    <select
                      onChange={(e) => setSelectedCategories([e.target.value])}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categoryData &&
                        categoryData.data.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="rating-section">
                    <h3>Ratings</h3>
                    <select
                      onChange={(e) =>
                        setFilters({ ...filters, rating: e.target.value })
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Rating
                      </option>
                      <option>1 star</option>
                      <option>2 star</option>
                      <option>3 star</option>
                      <option>4 star</option>
                      <option>5 star</option>
                    </select>
                  </div>
                  <div className="brand-section">
                    <h3>Brands</h3>
                    <select
                      onChange={(e) => handleBrandChange(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Brand
                      </option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="category-checkboxes">
                    <h3>Categories</h3>
                    {categoryData &&
                      categoryData.data.map((category) => (
                        <div key={category._id}>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleCategoryChange(category._id)}
                          />
                          <label>{category.name}</label>
                        </div>
                      ))}
                  </div>
                  <div className="rating-checkboxes">
                    <h3>Rating</h3>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="rating-option">
                        <input
                          type="checkbox"
                          checked={filters.rating === star}
                          onChange={() => handleStarChange(star)}
                        />
                        <label>
                          {Array.from({ length: star }, (_, i) => (
                            <FaStar key={i} color="#f4c150" />
                          ))}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="brand-checkboxes">
                    <h3>Brands</h3>
                    {brands.map((brand, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <label>{brand}</label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="product-grid">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={page === currentPage ? "active" : ""}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {showFilterPopup && (
            <div className="filter-popup">
              <div className="filter-popup-content">
                <button className="close-popup" onClick={toggleFilterPopup}>
                  Close
                </button>
                <h3>Price Range</h3>
                <div className="price-display">
                  <span>
                    Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  </span>
                </div>

                <h3>Sort by Price</h3>
                <div>
                  <input
                    type="checkbox"
                    checked={priceSortOption === "priceLowToHigh"}
                    onChange={() =>
                      setPriceSortOption(
                        priceSortOption === "priceLowToHigh"
                          ? null
                          : "priceLowToHigh"
                      )
                    }
                  />
                  <label>Price Low to High</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={priceSortOption === "priceHighToLow"}
                    onChange={() =>
                      setPriceSortOption(
                        priceSortOption === "priceHighToLow"
                          ? null
                          : "priceHighToLow"
                      )
                    }
                  />
                  <label>Price High to Low</label>
                </div>

                <h3>Sort by Date</h3>
                <div>
                  <input
                    type="checkbox"
                    checked={dateSortOption === "newest"}
                    onChange={() =>
                      setDateSortOption(
                        dateSortOption === "newest" ? null : "newest"
                      )
                    }
                  />
                  <label>Newest</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={dateSortOption === "oldest"}
                    onChange={() =>
                      setDateSortOption(
                        dateSortOption === "oldest" ? null : "oldest"
                      )
                    }
                  />
                  <label>Oldest</label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults; 