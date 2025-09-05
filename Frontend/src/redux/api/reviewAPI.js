import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reviewApi = createApi({
  reducerPath: 'reviewApi',
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
    getReviewsByProductId: builder.query({
      query: (productId) => `/api/review/product/${productId}`,
    }),
    getReviewById: builder.query({
      query: (reviewId) => `/api/review/${reviewId}`,
    }),
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: '/api/review/add-review',
        method: 'POST',
        body: reviewData,
      }),
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/api/review/delete-review/${reviewId}`,
        method: 'DELETE',
      }),
    }),
    toggleLikeOrDislike: builder.mutation({
      query: ({ reviewId, action }) => ({
        url: `/api/review/toggle-like-dislike/${reviewId}`,
        method: 'POST',
        body: { action },
      }),
    }),
  }),
});

export const {
  useGetReviewsByProductIdQuery,
  useGetReviewByIdQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useToggleLikeOrDislikeMutation,
} = reviewApi;

export default reviewApi;
