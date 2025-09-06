import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    products: [], // max 3
  },
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.products.find(p => p._id === action.payload._id);
      if (!exists && state.products.length < 3) {
        state.products.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    clearCompare: (state) => {
      state.products = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
