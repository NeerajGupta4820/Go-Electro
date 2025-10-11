import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../Controllers/wishlistController.js';
import { checkLogin } from '../Utils/jwt.js';

const router = express.Router();

router.get('/', checkLogin, getWishlist);
router.post('/add', checkLogin, addToWishlist);
router.post('/remove', checkLogin, removeFromWishlist);

export default router;