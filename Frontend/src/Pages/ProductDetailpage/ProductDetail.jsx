import { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, 
  FaShareAlt, 
  FaFacebook, 
  FaWhatsapp, 
  FaLink,
  FaTimes,
  FaInstagram,
  FaHeart,
  FaRegHeart,
  FaTelegram,
} from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { useParams } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToCompare, removeFromCompare } from '../../redux/slices/compareSlice';
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductByIdQuery, useGetRelatedProductsQuery } from "../../redux/api/productAPI";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import "./ProductDetail.css";
import ProductSlider from "../../Components/ProductSlider/ProductSlider";
import ReviewSection from "../../Components/reveiwsection/ReviewSection";

const ProductDetail = () => {
  
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [buttonColor, setButtonColor] = useState('#rgb(247, 139, 90)'); 
  const currentIndex = useRef(0); 

  const colors = ['#4dbdd6', '#28a745', '#ffc107', '#dc3545'];
  const product = data?.product;

  const { data: relatedData, isLoading: relatedLoading } = useGetRelatedProductsQuery(id);
  const relatedProducts = relatedData?.products;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const handleShareClick = () => {
    setShowShareModal(true);
  };
  
  const closeShareModal = () => {
    setShowShareModal(false);
  };
  
  const shareProduct = (platform) => {
    const productUrl = window.location.href;
    const shareText = `Check out ${product.title} on our store!`;
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`;
        break;
      case 'gmail':
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(product.title)}&body=${encodeURIComponent(shareText + ' ' + productUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(productUrl)
          .then(() => {
            toast.success("Link copied to clipboard!");
            setShowShareModal(false);
          })
          .catch(err => {
            toast.error("Failed to copy link");
          });
        return;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  // All hooks must be called before any return
  const compareProducts = useSelector(state => state.compare.products);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const [compareBtnState, setCompareBtnState] = useState('add');
  useEffect(() => {
    if (product && compareProducts.some(p => p._id === product._id)) {
      setCompareBtnState('remove');
    } else {
      setCompareBtnState('add');
    }
  }, [product, compareProducts]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedColor(product.images[0].color);
      setSelectedImage(product.images[0].imageLinks[0]);
    }
  }, [product]);

  // Wishlist state derived from redux
  const isWishlisted = Array.isArray(wishlistProducts) && wishlistProducts.some((p) => {
    if (!p) return false;
    if (typeof p === 'string') return p === product?._id;
    return p._id === product?._id || p.id === product?._id || p.productId === product?._id;
  });

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id)).unwrap()
        .then(() => {
          toast.info('Removed from wishlist', {
            position: 'top-center',
            autoClose: 1200,
            hideProgressBar: true,
            theme: 'dark',
          });
        })
        .catch((err) => {
          toast.error(err?.message || 'Failed to remove from wishlist', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: true,
            theme: 'dark',
          });
        });
    } else {
      dispatch(addToWishlist(product._id)).unwrap()
        .then(() => {
          toast.success('Added to wishlist', {
            position: 'top-center',
            autoClose: 1200,
            hideProgressBar: true,
            theme: 'dark',
          });
        })
        .catch((err) => {
          toast.error(err?.message || 'Failed to add to wishlist', {
            position: 'top-center',
            autoClose: 1500,
            hideProgressBar: true,
            theme: 'dark',
          });
        });
    }
  };

  // Early returns (no hooks below this)
  if (isLoading || relatedLoading) return <Loader />;
  if (isError || !product) return <p>Product not found</p>;

  // Compute values after hooks and early returns
  const imagesToDisplay = product.images.filter((image) => image.color === selectedColor);
  // const shortDescription unused here (kept for potential future use)
  const isCompared = compareProducts.some(p => p._id === product._id);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleAddToCart = () => {
    currentIndex.current = (currentIndex.current + 1) % colors.length;
    setButtonColor(colors[currentIndex.current]);
    dispatch(addToCart({productId:product._id,price:product.price,quantity:1,name:product.title,images:product.images}));
    toast.success("Added",{
      position:"top-center",
      autoClose:1000,
      hideProgressBar:true,
      theme:"dark",
    })
    setIsAdded(true);
    setTimeout(() => {
      setButtonColor('#rgb(247, 139, 90)'); 
      setIsAdded(false);
    }, 1500); 
  };

  const handleCompareClick = () => {
    if (isCompared) {
      dispatch(removeFromCompare(product._id));
      setCompareBtnState('add');
    } else {
      dispatch(addToCompare(product));
      setCompareBtnState('remove');
    }
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-main">
        <div className="product-detail-left">
          <div className="product-stock-corner">
            <p className={`product-stock ${product.stock > 0 ? 'instock' : 'outstock'}`}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
          </div>
          <div className="product-thumbnails">
            {imagesToDisplay.length > 0 &&
              imagesToDisplay[0].imageLinks.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className={`thumbnail-image ${imgUrl === selectedImage ? "active-thumbnail" : ""}`}
                  onClick={() => setSelectedImage(imgUrl)}
                />
              ))}
          </div>
          <div className="product-main-image">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected product"
                className="main-image"
              />
            )}
          </div>
        </div>
        <div className="product-detail-divider" />
        <div className="product-detail-info">
          <div className="product-detail-header-row">
            <h1>{product.title}</h1>
            <div className="product-header-actions">
              <button 
                className="share-btn-detail"
                onClick={handleShareClick}
              >
                <FaShareAlt /> Share
              </button>
              <button
                className={`compare-btn-detail ${isCompared ? 'active' : ''}`}
                onClick={handleCompareClick}
              >
                Compare
              </button>
              <button
                className={`wishlist-btn-detail ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{ background: 'none', border: 'none', marginLeft: 8 }}
              >
                {isWishlisted ? <FaHeart color="#e74c3c" size={24} /> : <FaRegHeart color="#e74c3c" size={24} />}
              </button>
            </div>
          </div>
          <div className="product-price-row">
            <span className="product-price-label">Price:</span>
            <span className="product-price-value">Rs.{product.price}</span>
          </div>
          {product.stock > 0 ? (
            <button 
              className={`add-to-cart ${isAdded ? 'added' : ''}`} 
              onClick={handleAddToCart}
              style={{ backgroundColor: buttonColor }} >
              <FaShoppingCart className={`cart-icon ${isAdded ? 'move' : ''}`} />
              {isAdded ? 'Added' : 'Add to Cart'}
            </button>
          ) : (
            <button className="notcart-icon" disabled>
              <FaShoppingCart/>Add to Cart
            </button>
          )}
          <div className="product-rating-row">
            <span className="product-rating-stars">
              {(() => {
                const stars = [];
                const rating = Number(product.ratings) || 0;
                for (let i = 1; i <= 5; i++) {
                  if (rating >= i) {
                    stars.push(<span key={i} className="star filled"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>);
                  } else if (rating > i - 1) {
                    // Partial fill for half/decimal
                    const percent = Math.round((rating - (i - 1)) * 100);
                    stars.push(
                      <span key={i} className="star partial">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <linearGradient id={`starGrad${i}`} x1="0" y1="0" x2="100%" y2="0">
                              <stop offset={`${percent}%`} stopColor="#ffc107" />
                              <stop offset={`${percent}%`} stopColor="#fff" />
                            </linearGradient>
                          </defs>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#starGrad${i})`} />
                        </svg>
                      </span>
                    );
                  } else {
                    stars.push(<span key={i} className="star empty"><svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="#fff" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>);
                  }
                }
                return stars;
              })()}
            </span>
          </div>

          {product.images.length > 1 ? (
            <div className="color-options">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === image.color ? "active" : ""}`}
                  onClick={() => {
                    setSelectedColor(image.color);
                    setSelectedImage(image.imageLinks[0]);
                  }}
                  style={{ backgroundColor: image.color, borderColor: selectedColor === image.color ? '#232a3a' : '#eee' }}
                />
              ))}
            </div>
          ) : ""}
          <div className="product-description">
            {showFullDescription
              ? product.description
              : product.description.split(" ").slice(0, 50).join(" ") + "..."}
          </div>
          <button
            onClick={toggleDescription}
            className={`toggle-description-btn${showFullDescription ? ' active' : ''}`}
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={closeShareModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="share-modal-cancel" onClick={closeShareModal}>
              <FaTimes />
            </button>
            <div className="share-modal-content">
              <h2 className="share-modal-title">Share this product</h2>
              {selectedImage && (
                <img src={selectedImage} alt={product.title} className="share-modal-image" />
              )}
              <p className="share-modal-product-name">{product.title}</p>
              <div className="share-modal-link-row">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly 
                  className="share-modal-link" 
                />
                <button 
                  className="share-modal-copy"
                  onClick={() => shareProduct('copy')}
                >
                  <FaLink /> Copy
                </button>
              </div>
              <div className="share-modal-socials">
                <button 
                  onClick={() => shareProduct('facebook')}
                  aria-label="Share on Facebook"
                >
                  <FaFacebook />
                </button>
                <button 
                  onClick={() => shareProduct('whatsapp')}
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </button>
                <button 
                  onClick={() => shareProduct('gmail')}
                  aria-label="Share via Gmail"
                >
                  <SiGmail />
                </button>
                <button 
                  onClick={() => shareProduct('telegram')}
                  aria-label="Share on Telegram"
                >
                  <FaTelegram />
                </button>
                 <button 
                  className="share-instagram"
                  onClick={() => shareProduct('instagram')}
                  aria-label="Share on Instagram"
                >
                  <FaInstagram />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ProductSlider 
        products={relatedProducts} 
        title="Related Products" 
        isLoading={false}  
      />
      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetail;