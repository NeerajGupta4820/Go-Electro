
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { getState }) => {
  const token = getState().user.token;
  const res = await axios.get(`${BASE_URL}/api/wishlist`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // backend may return { products: [...] } or the array directly
  if (Array.isArray(res.data)) return res.data;
  return res.data.products || [];
});


export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { getState }) => {
  const token = getState().user.token;
  const res = await axios.post(`${BASE_URL}/api/wishlist/add`, { productId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // backend may return a wishlist object or just the products array
  if (Array.isArray(res.data)) return res.data;
  return res.data.products || [];
});


export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { getState }) => {
  const token = getState().user.token;
  const res = await axios.post(`${BASE_URL}/api/wishlist/remove`, { productId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (Array.isArray(res.data)) return res.data;
  return res.data.products || [];
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.products = action.payload || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.products = action.payload || [];
      });
  },
});

export default wishlistSlice.reducer;
