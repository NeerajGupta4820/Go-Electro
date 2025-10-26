import { useState } from "react";
import { FaShoppingCart, FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  // Skeleton rendering when product is not available
  if (!product) {
    return (
      <Card className="relative bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100/50 overflow-hidden max-w-48 mx-auto">
        <CardContent className="p-0">
          <Skeleton className="w-full h-48 rounded-t-xl" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-5" />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </CardFooter>
      </Card>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        price: product.price,
        quantity: 1,
        name: product.title,
        images: product.images,
      })
    );
    toast.success("Added to cart", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      theme: "dark",
    });
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const productImage =
    product.images && product.images.length > 0 && product.images[0].imageLinks.length > 0
      ? product.images[0].imageLinks[0]
      : "/placeholder.jpg";

  // Wishlist logic
  const isWishlisted =
    Array.isArray(wishlistProducts) &&
    wishlistProducts.some((p) => {
      if (!p) return false;
      if (typeof p === "string") return p === product._id;
      return p._id === product._id || p.id === product._id || p.productId === product._id;
    });

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.info("Removed from wishlist", {
            position: "top-center",
            autoClose: 1200,
            hideProgressBar: true,
            theme: "dark",
          });
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to remove from wishlist", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "dark",
          });
        });
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.success("Added to wishlist", {
            position: "top-center",
            autoClose: 1200,
            hideProgressBar: true,
            theme: "dark",
          });
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to add to wishlist", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "dark",
          });
        });
    }
  };

  const isInStock = product.stock > 0;

  return (
    <Card
      className="relative bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 border border-gray-100/50 group overflow-hidden max-w-70 mx-auto"
    >
      <CardContent className="p-0">
        <div
          className="relative h-48 cursor-pointer group-hover:scale-105 transition-transform duration-300"
          onClick={() => handleImageClick(product._id)}
          role="button"
          tabIndex={0}
        >
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-contain rounded-t-xl"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-red-500 hover:text-red-600 hover:scale-110 transition-transform bg-white/80 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <FaHeart size={26} className="fill-current" />
            ) : (
              <FaRegHeart size={26} className="fill-current" />
            )}
          </Button>
          {!isInStock && (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-600 text-white font-semibold">
              Out of Stock
            </Badge>
          )}
          {product.discount && (
            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-500 text-white font-semibold">
              {product.discount}% Off
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 font-semibold text-base truncate">
              {product.title || "Unnamed Product"}
            </p>
            {product.ratings && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-600 text-sm">{product.ratings.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-orange-500 font-bold text-base">
            {product.price ? `Rs. ${product.price.toFixed(2)}` : "Price not available"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          onClick={() => handleImageClick(product._id)}
        >
          View Product
        </Button>
        <Button
          className={`flex-1 text-white rounded-lg transition-colors duration-200 ${
            isInStock
              ? `bg-blue-600 hover:bg-blue-700 ${isAdded ? "bg-blue-800" : ""}`
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          <FaShoppingCart className={`mr-2 transition-transform duration-300 ${isAdded ? "translate-x-1" : ""}`} />
          {isAdded ? "Added" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;