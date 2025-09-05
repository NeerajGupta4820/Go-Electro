import Review from '../Modals/reviewModel.js';
import Product from '../Modals/productModal.js';

const createOrUpdateReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;
        if (!productId || !userId || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const existingReview = await Review.findOne({ productId, userId });
        const allReviews = await Review.find({ productId });
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (existingReview) {
            const totalReviews = allReviews.length;
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);

            const newTotalRating = totalRating - existingReview.rating + rating; 
            const newAverageRating = newTotalRating / totalReviews; 

            existingReview.rating = rating; 
            existingReview.comment = comment;
            await existingReview.save();
            await Product.findByIdAndUpdate(productId, { ratings: newAverageRating });
            return res.status(200).json({ success: true, review: existingReview });
        } else {
            const newReview = new Review({ productId, userId, rating, comment });
            await newReview.save();
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0) + rating; 
            const newAverageRating = totalRating / (allReviews.length + 1); 
            await Product.findByIdAndUpdate(productId, { ratings: newAverageRating });

            return res.status(201).json({ success: true, review: newReview });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    }
};

const getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId }).populate('userId', 'name'); 
        
        res.status(200).json({ success: true, reviews });
    } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId).populate('userId', 'name');
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, review });
    } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    }
};

const toggleLikeOrDislike = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { action } = req.body;
      const userId = req.user._id;
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
      if (!review.likes) review.likes = [];
      if (!review.dislikes) review.dislikes = [];
      review.likes = review.likes.filter(id => id);
      review.dislikes = review.dislikes.filter(id => id);
  
      if (action === 'like') {
        if (review.likes.includes(userId)) {
          review.likes = review.likes.filter(id => id.toString() !== userId.toString());
        } else {
          review.likes.push(userId);
          review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());
        }
      } else if (action === 'dislike') {
        if (review.dislikes.includes(userId)) {
          review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());
        } else {
          review.dislikes.push(userId);
          review.likes = review.likes.filter(id => id.toString() !== userId.toString());
        }
      }
  
      await review.save();
  
      res.status(200).json({ success: true, review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
};
  
export {createOrUpdateReview,deleteReview,getReviewsByProductId,getReviewById,toggleLikeOrDislike};