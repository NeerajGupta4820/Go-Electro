import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import userReducer from './slices/userSlice.js';
import productReducer from './slices/productSlice.js';
import categoryReducer from './slices/categorySlice.js';
import userApi from './api/userAPI.js';
import productApi from './api/productAPI.js';
import categoryApi from './api/categoryAPI.js';
import reviewApi from './api/reviewAPI.js';
import cartApi from './api/cartAPI.js';
import orderApi from './api/orderAPI.js';
import couponAPI from './api/couponAPI.js';
import chartApi from './api/chartAPI.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [couponAPI.reducerPath]: couponAPI.reducer,
    [chartApi.reducerPath]:chartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      reviewApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      couponAPI.middleware,
      chartApi.middleware,
    ),
});

export default store;
