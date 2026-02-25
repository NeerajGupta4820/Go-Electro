import { useState, useRef } from 'react';
import { useGetAllProductsQuery } from '../../redux/api/productAPI.js';
import { useFetchAllCategoriesQuery } from '../../redux/api/categoryAPI';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';

// categories will be derived dynamically from API results below

const ProductCard = ({ product, onAddToCart, isAdded }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/product/${product._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <Card className="group relative overflow-hidden border bg-white hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative overflow-hidden bg-gray-50 p-6">
        <img
          src={product.images[0]?.imageLinks[0] || 'https://via.placeholder.com/400'}
          alt={product.title}
          className="w-full h-48 object-contain rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={handleImageClick}
        />
        <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
          ₹{product.price.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 min-h-[3.5rem] font-['Inter']">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          <span className="text-sm font-medium text-muted-foreground">
            {product.ratings} / 5
          </span>
        </div>

        <Button
          className={`w-full mt-auto flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
            isAdded
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-yellow-400 hover:bg-yellow-500 text-black'
          }`}
          onClick={onAddToCart}
        >
          <FaShoppingCart className={`w-4 h-4 ${isAdded ? 'animate-[cartBounce_0.7s_linear]' : ''}`} />
          {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};

export default function ProductCategories() {
  const [addedProducts, setAddedProducts] = useState(new Set());
  const scrollRefs = useRef({});
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllProductsQuery();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchAllCategoriesQuery();

  const categories = categoriesData?.data || [];

  if (isLoading || isCategoriesLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!data || !Array.isArray(data.products)) return <p className="text-center text-gray-600">No products available</p>;

  // compute categories that have at least 2 products
  const dynamicCategories = categories.filter((cat) => {
    const count = data.products.reduce((acc, p) => {
      // support cases where product.category may be an object with slug or an id
      const slug = p.category?.slug || p.category;
      return acc + (slug === cat.slug ? 1 : 0);
    }, 0);
    return count >= 2;
  });

  if (!dynamicCategories || dynamicCategories.length === 0) return null;

  // compute counts and take top 3 categories only
  const categoriesWithCount = dynamicCategories.map((cat) => {
    const count = data.products.reduce((acc, p) => {
      const slug = p.category?.slug || p.category;
      return acc + (slug === cat.slug ? 1 : 0);
    }, 0);
    return { ...cat, count };
  });

  const topCategories = categoriesWithCount
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const handleAddToCart = (productId, product) => {
    setAddedProducts((prev) => new Set(prev).add(productId));
    dispatch(
      addToCart({
        productId: product._id,
        price: product.price,
        quantity: 1,
        name: product.title,
        images: product.images,
      })
    );
    toast.success(`${product.title} added to cart!`, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
      theme: 'dark',
    });

    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 1500);
  };

  const scroll = (categorySlug, direction) => {
    const container = scrollRefs.current[categorySlug];
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes cartBounce {
            0% { transform: translateX(0); }
            50% { transform: translateX(10px) scale(1.2); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-in]">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shop by Category
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of audio devices and accessories
            </p>
          </div>

          {topCategories.map((category, index) => {
            const categoryProducts = data.products.filter((p) => (p.category?.slug || p.category) === category.slug);

            return (
              <div
                key={category.slug}
                className="mb-16 animate-[slideIn_0.5s_ease-in]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                    {category.name}
                  </h2>

                  {categoryProducts.length >= 4 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-gradient-to-br from-[#3aa2b4] to-[#4dbdd6] text-white border-none shadow-[0_2px_8px_rgba(62,125,242,0.08)] hover:bg-gradient-to-br hover:from-[#247ba0] hover:to-[#3aa2b4] transition-all duration-200"
                        onClick={() => scroll(category.slug, 'left')}
                        disabled={scrollRefs.current[category.slug]?.scrollLeft === 0}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-gradient-to-br from-[#3aa2b4] to-[#4dbdd6] text-white border-none shadow-[0_2px_8px_rgba(62,125,242,0.08)] hover:bg-gradient-to-br hover:from-[#247ba0] hover:to-[#3aa2b4] transition-all duration-200"
                        onClick={() => scroll(category.slug, 'right')}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {categoryProducts.length < 4 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product._id, product)}
                        isAdded={addedProducts.has(product._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    ref={(el) => (scrollRefs.current[category.slug] = el)}
                    className="flex overflow-x-auto gap-6 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {categoryProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex-none w-72 snap-start"
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={() => handleAddToCart(product._id, product)}
                          isAdded={addedProducts.has(product._id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}