import { useState } from "react";
import {
  useFetchAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../../redux/api/couponAPI";
import { useGetAllProductsQuery } from "../../../redux/api/productAPI";
import { toast } from "react-toastify";
import CouponList from "./CouponList";
import CouponForm from "./CouponForm";
import "./CouponPage.css";

const CouponPage = () => {
  const { data: coupons, isLoading, error } = useFetchAllCouponsQuery();
  const { data: products } = useGetAllProductsQuery();

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  const handleAddCoupon = () => {
    setIsEditing(true);
    setEditCoupon(null);
  };

  const handleEditCoupon = (coupon) => {
    setIsEditing(true);
    setEditCoupon({
      ...coupon,
      products: coupon.products.map((product) => product._id),
    });
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteCoupon(couponId).unwrap();
      toast.success("Deleted successfully", { theme: "dark" });
    } catch (error) {
      toast.error(`Failed to delete coupon: ${error.message}`, { theme: "dark" });
      console.error(error);
    }
  };

  return (
    <div className="coupon-page">
      {isEditing ? (
        <CouponForm
          products={products?.products || []}
          createCoupon={createCoupon}
          updateCoupon={updateCoupon}
          editCoupon={editCoupon}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <CouponList
          coupons={coupons?.coupons || []}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditCoupon}
          onDelete={handleDeleteCoupon}
          onAdd={handleAddCoupon}
        />
      )}
    </div>
  );
};

export default CouponPage;
