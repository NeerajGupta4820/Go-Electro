import { useState, useEffect, useCallback } from "react";
import { FaBoxOpen, FaStar } from "react-icons/fa";
import { useGetAllProductsQuery } from "../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../redux/api/categoryAPI";
import { useLocation } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { Button } from "@/Components/ui/button";
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Slider } from "@/Components/ui/slider";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/Components/ui/dialog";

const AllProducts = () => {
  const location = useLocation();
  const [Product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
  });

  const [selectedCategories, setSelectedCategories] = useState(
    location.state?.category ? [location.state.category] : []
  );
  const [priceSortOption, setPriceSortOption] = useState(null);
  const [dateSortOption, setDateSortOption] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 779);

  const { data: products, error, isLoading } = useGetAllProductsQuery();
  const { data: categoryData } = useFetchAllCategoriesQuery();

  useEffect(() => {
    if (products) {
      setProduct(products.products);
      setFilteredProducts(products.products);
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 779);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = useCallback(() => {
    let updatedProducts = Product;

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
      updatedProducts = updatedProducts.sort((a, b) => b.price - b.price);
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
  }, [Product, filters, selectedCategories, priceSortOption, dateSortOption]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (location.state && location.state.category) {
      setSelectedCategories([location.state.category]);
      setCurrentPage(1);
    }
  }, [location.state]);

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
    setFilteredProducts(Product);
    setCurrentPage(1);
  };

  const brands = [...new Set(Product.map((item) => item.brand))];

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm">
        <Button
          onClick={toggleFilterPopup}
          className="bg-blue-600 text-white font-semibold uppercase tracking-wide hover:bg-blue-700 transition-transform hover:-translate-y-0.5"
        >
          Sorting
        </Button>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="border-blue-600 text-blue-600 font-semibold uppercase tracking-wide hover:bg-blue-50 hover:-translate-y-0.5"
        >
          Reset
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:min-w-[12rem] md:flex-col flex-row justify-between md:justify-start bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm">
          {isSmallScreen ? (
            <>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Categories
                </h3>
                <Select
                  onValueChange={(value) => setSelectedCategories([value])}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryData?.data.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Ratings
                </h3>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, rating: parseInt(value) })
                  }
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <SelectItem key={star} value={star}>
                        {star} Star{star > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Brands
                </h3>
                <Select
                  onValueChange={(value) => handleBrandChange(value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand, index) => (
                      <SelectItem key={index} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Categories
                </h3>
                {categoryData?.data.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center gap-2 mb-2"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category._id)}
                      onCheckedChange={() => handleCategoryChange(category._id)}
                    />
                    <label className="text-sm text-gray-600 font-medium">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Rating
                </h3>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={filters.rating === star}
                      onCheckedChange={() => handleStarChange(star)}
                    />
                    <label className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                      {Array.from({ length: star }, (_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                  Brands
                </h3>
                {brands.map((brand, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <label className="text-sm text-gray-600 font-medium">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex-1">
          {currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-8 mx-auto max-w-2xl my-8">
              <FaBoxOpen className="text-blue-500 text-5xl mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                No products found
              </h2>
              <p className="text-gray-600 text-sm mb-4 text-center">
                We could not find any products matching your filters or search.
              </p>
              <Button
                onClick={resetFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            className={`min-w-[2.5rem] font-semibold ${
              page === currentPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border-gray-300 text-gray-600 hover:bg-blue-50"
            } transition-transform hover:-translate-y-0.5`}
            onClick={() => {
              window.scrollTo(0, 0);
              setCurrentPage(page);
            }}
          >
            {page}
          </Button>
        ))}
      </div>

      <Dialog open={showFilterPopup} onOpenChange={setShowFilterPopup}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">
              Filter & Sort
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                Price Range
              </h3>
              <Slider
                defaultValue={filters.priceRange}
                min={0}
                max={100000}
                step={100}
                onValueChange={(values) =>
                  setFilters((prev) => ({ ...prev, priceRange: values }))
                }
                className="mt-4"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                Sort by Price
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={priceSortOption === "priceLowToHigh"}
                    onCheckedChange={() =>
                      setPriceSortOption(
                        priceSortOption === "priceLowToHigh"
                          ? null
                          : "priceLowToHigh"
                      )
                    }
                  />
                  <label className="text-sm text-gray-600 font-medium">
                    Price Low to High
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={priceSortOption === "priceHighToLow"}
                    onCheckedChange={() =>
                      setPriceSortOption(
                        priceSortOption === "priceHighToLow"
                          ? null
                          : "priceHighToLow"
                      )
                    }
                  />
                  <label className="text-sm text-gray-600 font-medium">
                    Price High to Low
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 uppercase border-b-2 border-indigo-500 pb-2 mb-4">
                Sort by Date
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={dateSortOption === "newest"}
                    onCheckedChange={() =>
                      setDateSortOption(
                        dateSortOption === "newest" ? null : "newest"
                      )
                    }
                  />
                  <label className="text-sm text-gray-600 font-medium">
                    Newest
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={dateSortOption === "oldest"}
                    onCheckedChange={() =>
                      setDateSortOption(
                        dateSortOption === "oldest" ? null : "oldest"
                      )
                    }
                  />
                  <label className="text-sm text-gray-600 font-medium">
                    Oldest
                  </label>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProducts;
