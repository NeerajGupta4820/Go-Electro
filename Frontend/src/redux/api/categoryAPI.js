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
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    fetchAllCategories: builder.query({
      query: () => '/api/category/all',
      providesTags: ['Category']
    }),
    getCategoryById: builder.query({
      query: (id) => `/api/category/${id}`,
      providesTags: ['Category']
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/category/create',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category']
    }),
    updateCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `/api/category/update/${id}`,
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category']
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/category/delete/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Category']
    }),
  }),
});

export const { 
  useFetchAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} = categoryApi;

export default categoryApi;
