import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, setCartData, clearCart } from "../../redux/slices/cartSlice";
import { FaBoxOpen } from "react-icons/fa";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Separator } from "@/Components/ui/separator";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], totalAmount, totalQuantity } = useSelector((state) => state.cart.cart || {});

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId }));
    toast.success("Item removed from cart.");
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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartData"));
    if (savedCart) {
      dispatch(setCartData(savedCart));
    }
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Your Shopping Cart</h1>

      {totalQuantity === 0 ? (
        <Card className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg text-center border border-gray-200">
          <CardContent className="flex flex-col items-center">
            <FaBoxOpen className="text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Looks like you haven’t added anything yet. Discover our collection and start shopping!
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
              onClick={() => navigate("/allproducts")}
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Cart Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items (Left) */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={item.productId.images[0]?.imageLinks[0] || "defaultImage.jpg"}
                      alt={item.productId.title}
                      className="w-24 h-24 object-cover rounded-md border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">{item.productId.title}</h4>
                      <p className="text-gray-600 text-sm">Price: ₹{item.productId.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                          className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.productId._id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center border-gray-300 focus:ring-blue-500"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                          className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-blue-600">
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item.productId._id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary (Right) */}
            <div className="lg:w-80 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Order Summary</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Price:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount (10%):</span>
                  <span>- ₹{(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-blue-600">
                  <span>Subtotal:</span>
                  <span>₹{(totalAmount - totalAmount * 0.1 + totalAmount * 0.05).toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition-all duration-200"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full mt-3 border-red-500 text-red-500 hover:bg-red-50 rounded-lg py-2"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cart;