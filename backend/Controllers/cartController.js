import Cart from "../Modals/cartModal.js";
import Product from "../Modals/productModal.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        cartItems: [],
        totalAmount: 0,
        totalQuantity: 0,
      });
    }

    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (existingItemIndex > -1) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      const newItem = {
        productId,
        name: product.title,
        price: product.price,
        quantity,
      };
      cart.cartItems.push(newItem);
    }

    cart.totalQuantity += quantity;
    cart.totalAmount += product.price * quantity;

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Item added to cart", cart });

  } catch (error) {

    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

const getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate({
        path: 'cartItems.productId',
        select: 'title price images rating numReviews'
    });;
  
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
      return res.status(200).json({ success: true, cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
  
const clearCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
      cart.cartItems = [];
      cart.totalQuantity = 0;
      cart.totalAmount = 0;
  
      await cart.save();
  
      return res.status(200).json({ success: true, message: 'Cart cleared', cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const updateCart = async (req, res) => {
  const { cartItems, totalQuantity, totalAmount } = req.body.cart; 
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalQuantity,
        totalAmount,
      });
    } else {
      cart.cartItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      cart.totalQuantity = totalQuantity;
      cart.totalAmount = totalAmount;
    }

    await cart.save();

    return res.status(200).json({ success: true, message: 'Cart updated successfully', cart });

  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};





export {updateCart,getCart,clearCart,addToCart};