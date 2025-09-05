import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cart: {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action) => {
      const cart = action.payload;
      state.cart.cartItems = cart.cartItems ;
      state.cart.totalQuantity = cart.totalQuantity ;
      state.cart.totalAmount = cart.totalAmount ;

      localStorage.setItem("cartData", JSON.stringify(cart));
    },
    addToCart: (state, action) => {
      const { productId, price, quantity, name, images } = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item.productId._id === productId
      );

      if (existingItem) {
        state.cart.totalQuantity += quantity;
        existingItem.quantity += quantity;
        state.cart.totalAmount += price * quantity;
      } else {
        state.cart.cartItems.push({
          productId: { _id: productId, title: name, price, images },
          quantity,
        });

        state.cart.totalQuantity += quantity;
        state.cart.totalAmount += price * quantity;
      }
      const cartData = {
        cartItems: state.cart.cartItems,
        totalQuantity: state.cart.totalQuantity,
        totalAmount: state.cart.totalAmount,
      };
      localStorage.setItem("cartData", JSON.stringify(cartData));
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cart.cartItems.findIndex(
        (item) => item.productId._id === action.payload.productId
      );

      if (itemIndex !== -1) {
        const item = state.cart.cartItems[itemIndex];
        state.cart.totalQuantity -= item.quantity;
        state.cart.totalAmount -= item.productId.price * item.quantity;
        state.cart.cartItems.splice(itemIndex, 1);

        const cartData = {
          cartItems: state.cart.cartItems,
          totalQuantity: state.cart.totalQuantity,
          totalAmount: state.cart.totalAmount,
        };
        localStorage.setItem("cartData", JSON.stringify(cartData));
      }
    },
    updateQuantity: (state, action) => {
      const existingItem = state.cart.cartItems.find(
        (item) => item.productId._id === action.payload.productId
      );

      if (existingItem) {
        const newQuantity = action.payload.quantity;
        const quantityDifference = newQuantity - existingItem.quantity;

        if (newQuantity < 1) {
          state.cart.totalQuantity -= existingItem.quantity;
          state.cart.totalAmount -= existingItem.productId.price * existingItem.quantity;
          state.cart.cartItems = state.cart.cartItems.filter(
            (item) => item.productId._id !== existingItem.productId._id
          );
          toast.success("Deleted", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            theme: "dark",
          });
        } else {
          state.cart.totalQuantity += quantityDifference;
          state.cart.totalAmount += quantityDifference * existingItem.productId.price;
          existingItem.quantity = newQuantity;
        }

        const cartData = {
          cartItems: state.cart.cartItems,
          totalQuantity: state.cart.totalQuantity,
          totalAmount: state.cart.totalAmount,
        };
        localStorage.setItem("cartData", JSON.stringify(cartData));
      }
    },
    clearCart: (state) => {
      state.cart.cartItems = [];
      state.cart.totalAmount = 0;
      state.cart.totalQuantity = 0;
      localStorage.removeItem("cartData");
    },
  },
});

export const { setCartData, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
