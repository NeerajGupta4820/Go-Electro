import { useState, useEffect } from "react";
import {FaStar,FaThumbsDown,FaThumbsUp,FaRegStar,FaUser,} from "react-icons/fa";
import PropTypes from "prop-types";
import {useGetReviewsByProductIdQuery,useAddReviewMutation,useToggleLikeOrDislikeMutation,} from "../../redux/api/reviewAPI.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./ReviewSection.css";

const ReviewItem = ({ item, onToggleLikeOrDislike }) => (
  <div className="review-item">
    <div className="review-user">
      <FaUser className="review-avatar" />
      <div className="review-details">
        <h5 className="review-name">{item.userId.name}</h5>

        <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          i < item.rating ? <FaStar key={i} className="active" /> : <FaRegStar key={i} className="inactive" />
        ))}

        </div>
        <p className="review-date">
          Comment At: {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="review-text">{item.comment}</div>
    <div className="review-actions">
      <button
        onClick={() => onToggleLikeOrDislike(item._id, "like")}
        className="review-button"
      >
        <FaThumbsUp />
        {item.likes ? item.likes.length : 0}
      </button>
      <button
        onClick={() => onToggleLikeOrDislike(item._id, "dislike")}
        className="review-button"
      >
        <FaThumbsDown />
        {item.dislikes ? item.dislikes.length : 0}
      </button>
    </div>
  </div>
);

ReviewItem.propTypes = {
  item: PropTypes.object.isRequired,
  onToggleLikeOrDislike: PropTypes.func.isRequired,
};

const ReviewSection = ({ productId }) => {
  const {
    data: { reviews: fetchedReviews } = { reviews: [] },
    isLoading,
    isError,
    refetch,
  } = useGetReviewsByProductIdQuery(productId);
  const [addReview] = useAddReviewMutation();
  const [toggleLikeOrDislike] = useToggleLikeOrDislikeMutation();

  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);

  const user = useSelector((state) => state.user.user);
  const userId = user ? user._id : null;

  useEffect(() => {
    if (fetchedReviews && fetchedReviews.length > 0) {
      setReviews(fetchedReviews);
    }
  }, [fetchedReviews]);

  const loadMoreComments = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }
    if (!commentText.trim() || rating === 0) {
      toast.error("Comment and rating are required.");
      return;
    }

    const reviewData = {
      productId,
      comment: commentText,
      rating,
      userId,
    };

    try {
      await addReview(reviewData).unwrap();
      setCommentText("");
      setRating(0);
      toast.success("Review submitted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to submit review: ", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleToggleLikeOrDislike = async (reviewId, action) => {
    try {
      await toggleLikeOrDislike({ reviewId, action }).unwrap();
      refetch();
    } catch (error) {
      toast.error(`Failed to ${action} review: ${error.message}`);
    }
  };

  const recommendationPercentage =
    reviews.length > 0
      ? (
          (reviews.filter((review) => review.rating >= 4).length /
            reviews.length) *
          100
        ).toFixed(1)
      : 0;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading reviews.</p>;

  return (
    <section className="review-section">
      <div className="review-container">
        <div className="review-header">
          <h2 className="review-title">Reviewer Recommendation</h2>
          <div className="review-recommendation">
            {recommendationPercentage}%
          </div>
          <p className="review-subtitle">
            Recommended by {reviews.length} reviewers.
          </p>
          <div className="review-average">
            <span>Average Rating: {averageRating}</span>
          </div>
        </div>

        <div className="new-review">
          <div className="rating-input">
            <div className="new-review">
              <div className="rating-input">
                {[...Array(5)].map((_, i) =>
                  i < rating ? (
                    <FaStar
                      key={i}
                      className="active"
                      onClick={() => setRating(i + 1)}
                    />
                  ) : (
                    <FaRegStar
                      key={i}
                      className="inactive"
                      onClick={() => setRating(i + 1)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment"
            className="comment-input"
          />
          <button onClick={handleSubmit} className="review-submit">
            New Comment
          </button>
        </div>

        {reviews.length > 0 ? (
          reviews
            .slice(0, visibleReviews)
            .map((item) => (
              <ReviewItem
                item={item}
                key={item._id}
                onToggleLikeOrDislike={handleToggleLikeOrDislike}
              />
            ))
        ) : (
          <p>No reviews available for this product.</p>
        )}

        {visibleReviews < reviews.length && (
          <button onClick={loadMoreComments} className="load-more">
            Load More Comments
          </button>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
