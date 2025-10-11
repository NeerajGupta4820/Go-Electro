import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import Loader from '../Loader/Loader';
import { FaHeartBroken, FaTrashAlt, FaBoxOpen } from 'react-icons/fa';
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
    dispatch(removeFromWishlist(productId));
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
        <div className="wishlist-products">
          {products.map((product) => (
            <div key={product._id} className="wishlist-product-card">
              <div className="wishlist-product-img-wrap">
                <img src={product.images?.[0]?.imageLinks?.[0] || product.image || '/placeholder.jpg'} alt={product.name || product.title} />
              </div>
              <div className="wishlist-product-info">
                <h3 className="wishlist-product-name">
                  <FaHeartBroken className="wishlist-title-icon" /> {product.name || product.title}
                </h3>
                {product.price && <p className="wishlist-product-price">Rs. {product.price}</p>}
                <button className="wishlist-remove-btn" onClick={() => handleRemove(product._id)}>
                  <FaTrashAlt className="wishlist-remove-icon" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
