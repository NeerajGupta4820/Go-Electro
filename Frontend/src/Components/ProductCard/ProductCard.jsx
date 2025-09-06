import { useState, useRef, useEffect } from "react";
import { FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [buttonColor, setButtonColor] = useState("#rgb(247, 139, 90)");
  const [isZooming, setIsZooming] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className={`product-card ${isZooming ? "zooming" : ""}`}>
      <div className="products-card-img">
        <img
          onClick={() => handleImageClick(product._id)}
          src={productImage}
          alt={product.title}
          className="product-photo"
        />
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
