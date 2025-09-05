import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    fetchAllCategories: builder.query({
      query: () => '/api/category/all',
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/category/create',
        method: 'POST',
        body: categoryData,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `/api/category/update/${id}`,
        method: 'POST',
        body: categoryData,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/category/delete/${id}`,
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useFetchAllCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} = categoryApi;

export default categoryApi;
