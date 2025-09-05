import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const couponAPI = createApi({
    reducerPath: "couponAPI",
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
        fetchAllCoupons: builder.query({
            query: () => "/api/coupon/getAll",
        }),
        createCoupon: builder.mutation({
            query: (newCoupon) => ({
                url: "/api/coupon/create",
                method: "POST",
                body: newCoupon,
            })
        }),
        updateCoupon: builder.mutation({
            query: ({ _id, code,discount,products }) => ({
                url: `/api/coupon/update/${_id}`,
                method: "POST",
                body: {code,discount,products},
            })
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/api/coupon/delete/${id}`,
                method: "POST"
            })
        })
    })
});

export const { 
    useFetchAllCouponsQuery, 
    useCreateCouponMutation, 
    useUpdateCouponMutation, 
    useDeleteCouponMutation 
} = couponAPI;

export default couponAPI;
