import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, setCartData, clearCart } from "../../redux/slices/cartSlice";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], totalAmount, totalQuantity } = useSelector((state) => state.cart.cart || {});
  console.log(cartItems)

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      handleRemove(itemId);
    } else {
      dispatch(updateQuantity({ productId: itemId, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared successfully.");
  };

  const handleCheckout=()=>{
    navigate('/checkout')
  }

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartData"));
    if (savedCart) {
      dispatch(setCartData(savedCart));
    }
  }, [dispatch]);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {totalQuantity === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.productId.images[0]?.imageLinks[0] || "defaultImage.jpg"}
                  alt={item.productId.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h4>{item.productId.title}</h4>
                  <p>Price: ₹{item.productId.price}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹{item.productId.price * item.quantity}
                  <button className="delete-button" onClick={() => handleRemove(item.productId._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Total Items:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="summary-item">
              <span>Total Price:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-item">
              <span>Discount (10%):</span>
              <span>- ₹{(totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax (5%):</span>
              <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
            </div>
            <div className="summary-item subtotal">
              <span>Subtotal:</span>
              <span>₹{(totalAmount - totalAmount * 0.1 + totalAmount * 0.05).toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
            <button className="clear-cart-button" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
