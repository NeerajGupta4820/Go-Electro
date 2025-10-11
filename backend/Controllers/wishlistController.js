import Wishlist from '../Modals/wishlistModel.js';
import Product from '../Modals/productModal.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    // return the wishlist with populated product documents so the frontend
    // receives full product objects (images, title, price, etc.)
    const populated = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(populated || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
    }
    // return the wishlist with populated products after removal
    const populatedAfterRemove = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(populatedAfterRemove || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};