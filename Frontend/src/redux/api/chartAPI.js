import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const chartApi = createApi({
  reducerPath: "chartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProduct: builder.mutation({
      query: () => ({
        url: "/api/chart/product",
        method: "POST",
      }),
    }),
    getOrder: builder.mutation({
      query: () => ({
        url: "/api/chart/order",
        method: "POST",
      }),
    }),
    getUsers: builder.mutation({
      query: () => ({
        url: "/api/chart/users",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetProductMutation,
  useGetOrderMutation,
  useGetUsersMutation,
} = chartApi;

export default chartApi;
