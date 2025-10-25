import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import Loader from '../Loader/Loader';
import { FaHeartBroken, FaBoxOpen,FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './WishlistCard.css';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user.token]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId)).unwrap()
      .then(() => {
        toast.info('Removed from wishlist', { position: 'top-center', autoClose: 1200, hideProgressBar: true, theme: 'dark' });
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to remove', { position: 'top-center', autoClose: 1500, hideProgressBar: true, theme: 'dark' });
      });
  };

  const navigate = useNavigate();

  const handleView = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loader />;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">
        <FaHeartBroken className="wishlist-title-icon" /> My Wishlist
      </h2>
      {products.length === 0 ? (
        <div className="wishlist-empty">
          <FaBoxOpen className="wishlist-empty-icon" size={48} />
          <p>No products in your wishlist yet.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((productOrId) => {
            const product = typeof productOrId === 'string' ? { _id: productOrId, title: 'Product', price: null, images: [] } : productOrId || {};
            const img = product.images?.[0]?.imageLinks?.[0] || product.image || '/placeholder.jpg';
            return (
              <div className="wishlist-card-modern image-only" key={product._id}>
                <div
                  className="wc-image clickable"
                  onClick={() => handleView(product._id)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={img} alt={product.name || product.title || 'Product'} />
                  <button
                    className="wc-heart-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemove(product._id); }}
                    aria-label="Remove from wishlist"
                  >
                    <FaHeart />
                  </button>
                  <div className="wc-overlay">
                    <div className="wc-overlay-title">{product.name || product.title || 'Unnamed Product'}</div>
                    <div className="wc-overlay-price">{product.price ? `Rs. ${product.price}` : 'Price not available'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
