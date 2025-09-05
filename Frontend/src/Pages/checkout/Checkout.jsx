import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddOrderMutation, useVerifyPaymentMutation } from "../../redux/api/orderAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/slices/cartSlice";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.cart.cart || {});
  const user = useSelector((state) => state.user.user);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const [addOrder] = useAddOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (orderId, razorpayOrderId, razorpayAmount) => {
    console.log("Razorpay amount in paise (frontend):", razorpayAmount);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayAmount,
      currency: "INR",
      name: "GOElecto",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async (response) => {
        try {
          const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          await verifyPayment(paymentData).unwrap();
          toast.success("Payment successful and order placed!");
          dispatch(clearCart());
          navigate("/");
        } catch (error) {
          toast.error("Payment verification failed.",error.message);
        }
      },
      prefill: { name: user.name, email: user.email },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      shippingInfo,
      subtotal: totalAmount,
      tax: totalAmount * 0.05,
      shippingCharges: 0,
      discount: totalAmount * 0.1,
      total: totalAmount - totalAmount * 0.1 + totalAmount * 0.05,
      orderItems: cartItems.map((item) => ({
        name: item.productId.title,
        photo: item.productId.images[0]?.imageLinks[0],
        price: item.productId.price,
        quantity: item.quantity,
        productId: item.productId._id,
      })),
      user: user._id,
    };

    try {
      const { razorpayOrderId, razorpayAmount, order } = await addOrder(orderData).unwrap();
      toast.info("Redirecting to payment...");
      handlePayment(order._id, razorpayOrderId, razorpayAmount);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(
        `❌ Checkout Failed: ${error.response?.data?.message || error.message}`,
        { position: "top-center", autoClose: 5000, hideProgressBar: true, theme: "dark" }
      );
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-progress">Step 2: Shipping Details</div>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>Pin Code</label>
            <input
              type="number"
              name="pinCode"
              value={shippingInfo.pinCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="place-order-button"
            disabled={
              !shippingInfo.address ||
              !shippingInfo.city ||
              !shippingInfo.state ||
              !shippingInfo.country ||
              !shippingInfo.pinCode
            }
          >
            Place Order
          </button>
        </form>
        <div className="checkout-cart-summary">
          <h3>Your Cart</h3>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.productId._id}>
              <img
                src={item.productId.images[0]?.imageLinks[0]}
                alt={item.productId.title}
              />
              <div style={{ color: "black" }}>
                <p>{item.productId.title}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rs.{item.productId.price}</p>
              </div>
            </div>
          ))}
          <p>Total: Rs.{totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
