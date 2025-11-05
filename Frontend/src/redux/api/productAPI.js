import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => '/api/product/allproducts',
      providesTags: ['Product']
    }),
    getProductById: builder.query({
      query: (id) => `/api/product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),
    getLatestProducts: builder.query({
      query: () => '/api/product/latestproducts',
      providesTags: ['Product']
    }),
    getRelatedProducts: builder.query({
      query: (id) => `api/product/related-products/${id}`,
      providesTags: ['Product']
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/product/addproduct',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/api/product/updateproduct/${id}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Product',
        { type: 'Product', id }
      ]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/product/deleteproduct/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product']
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetLatestProductsQuery,
  useGetRelatedProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

export default productApi;
