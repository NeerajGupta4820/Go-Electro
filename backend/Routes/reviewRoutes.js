import express from "express";
import {
  createOrUpdateReview,
  deleteReview,
  getReviewsByProductId,
  getReviewById,
  toggleLikeOrDislike,
} from "../Controllers/reviewController.js";
import { checkLogin } from "../Utils/jwt.js";
const router = express.Router();

router.post("/add-review", checkLogin, createOrUpdateReview);
router.delete("/delete-review/:reviewId", checkLogin, deleteReview);
router.get("/product/:productId", getReviewsByProductId);
router.get("/:reviewId", getReviewById);
router.post("/toggle-like-dislike/:reviewId", checkLogin, toggleLikeOrDislike);

export default router;
