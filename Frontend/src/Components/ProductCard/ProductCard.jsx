import { useState, useRef, useEffect } from "react";
import { FaShoppingCart, FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [buttonColor, setButtonColor] = useState("#rgb(247, 139, 90)");
  const [isZooming, setIsZooming] = useState(true);
  const navigate = useNavigate();
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const colors = ["#4dbdd6", "#28a745", "#ffc107", "#dc3545"];
  const currentIndex = useRef(0);

  useEffect(() => {
    const zoomTimeout = setTimeout(() => {
      setIsZooming(false);
    }, 10000);
    return () => clearTimeout(zoomTimeout);
  }, []);

  const handleAddToCart = () => {
    currentIndex.current = (currentIndex.current + 1) % colors.length;
    setButtonColor(colors[currentIndex.current]);
    dispatch(
      addToCart({
        productId: product._id,
        price: product.price,
        quantity: 1,
        name: product.title,
        images: product.images,
      })
    );
    toast.success("Added", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      theme: "dark",
    });
    setIsAdded(true);

    setTimeout(() => {
      setButtonColor("#rgb(247, 139, 90)");
      setIsAdded(false);
    }, 1500);
  };

  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const productImage =
    product.images &&
    product.images.length > 0 &&
    product.images[0].imageLinks.length > 0
      ? product.images[0].imageLinks[0]
      : "path/to/placeholder-image.jpg";

  // Wishlist logic
  const isWishlisted = wishlistProducts.some((p) => p._id === product._id);
  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <div className={`product-card ${isZooming ? "zooming" : ""}`}>
      <div className="products-card-img">
        <img
          onClick={() => handleImageClick(product._id)}
          src={productImage}
          alt={product.title}
          className="product-photo"
        />
        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none' }}
        >
          {isWishlisted ? (
            <FaHeart color="#e74c3c" size={24} />
          ) : (
            <FaRegHeart color="#e74c3c" size={24} />
          )}
        </button>
      </div>
      <div className="product-card-info">
        <h4 className="product-title">{product.title}</h4>
        <p>Rs.{product.price}</p>
        <div className="products-stars">
          {[...Array(5)].map((_, i) =>
            i < product.ratings ? (
              <FaStar key={i} className="active" />
            ) : (
              <FaRegStar key={i} className="inactive" style={{ color: "#ffc107" }} />
            )
          )}
        </div>
        {product.stock > 0 ? (
          <button
            className={`add-to-cart ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
            style={{ backgroundColor: buttonColor }}
          >
            <FaShoppingCart className={`cart-icon ${isAdded ? "move" : ""}`} />
            {isAdded ? "Added" : "Add to Cart"}
          </button>
        ) : (
          <button className="notcart-icon" disabled>
            <FaShoppingCart />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
