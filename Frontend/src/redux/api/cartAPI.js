import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/api/cart/get',
      method:"GET"
    }),
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: '/api/cart/update',
        method: 'POST',
        body: cartItem,
      }),
    }),
    updateCart: builder.mutation({
      query: (cart) => ({
        url: '/api/cart/update',
        method: 'POST',
        body: { cart },
      }),
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/api/cart/delete',
        method: 'POST',
      }),
    }),

  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
  useSyncCartMutation,
} = cartApi;

export default cartApi;
