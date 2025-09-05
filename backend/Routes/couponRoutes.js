import express from "express";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from "../Controllers/couponController.js";
import { checkAdmin } from "../Utils/jwt.js";
const couponRoutes = express.Router();

couponRoutes.post("/create",checkAdmin,createCoupon);
couponRoutes.post("/update/:id",checkAdmin,updateCoupon);
couponRoutes.post("/delete/:id",checkAdmin,deleteCoupon);
couponRoutes.get("/getAll",getAllCoupons);

export default couponRoutes;