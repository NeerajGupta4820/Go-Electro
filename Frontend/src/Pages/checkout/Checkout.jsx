import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddOrderMutation, useVerifyPaymentMutation } from "../../redux/api/orderAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/slices/cartSlice";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card
import { Input } from "@/components/ui/input"; // Shadcn Input
import { Label } from "@/components/ui/label"; // Shadcn Label

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
          toast.error(`Payment verification failed: ${error.message}`);
        }
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#2563eb" }, // Blue theme for Razorpay
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Checkout</h2>
        <div className="text-center mb-6 text-lg font-medium text-gray-600">
          Step 2: Shipping Details
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping Info Form */}
          <Card className="flex-1 bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                    Country
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode" className="text-sm font-semibold text-gray-700">
                    Pin Code
                  </Label>
                  <Input
                    id="pinCode"
                    type="number"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Enter your pin code"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  disabled={
                    !shippingInfo.address ||
                    !shippingInfo.city ||
                    !shippingInfo.state ||
                    !shippingInfo.country ||
                    !shippingInfo.pinCode
                  }
                >
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Cart Summary */}
          <Card className="flex-1 bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId._id} className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <img
                    src={item.productId.images[0]?.imageLinks[0] || "defaultImage.jpg"}
                    alt={item.productId.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.productId.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ₹{item.productId.price}</p>
                  </div>
                  <p className="font-semibold text-blue-600">₹{item.productId.price * item.quantity}</p>
                </div>
              ))}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount (10%):</span>
                  <span>- ₹{(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%):</span>
                  <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-blue-600">
                  <span>Total:</span>
                  <span>₹{(totalAmount - totalAmount * 0.1 + totalAmount * 0.05).toFixed(2)}</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">Secured by Razorpay</p>
                <div className="flex justify-center gap-2 mt-2">
                  <img src="/path-to-visa-logo.png" alt="Visa" className="h-6" />
                  <img src="/path-to-mastercard-logo.png" alt="Mastercard" className="h-6" />
                  <img src="/path-to-razorpay-logo.png" alt="Razorpay" className="h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;