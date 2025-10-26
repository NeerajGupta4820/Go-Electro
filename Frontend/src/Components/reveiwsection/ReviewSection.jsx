import { useState, useEffect } from "react";
import { FaStar, FaThumbsDown, FaThumbsUp, FaRegStar, FaUser } from "react-icons/fa";
import PropTypes from "prop-types";
import {
  useGetReviewsByProductIdQuery,
  useAddReviewMutation,
  useToggleLikeOrDislikeMutation,
} from "../../redux/api/reviewAPI.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const ReviewItem = ({ item, onToggleLikeOrDislike }) => (
  <Card className="mb-4 border-b border-gray-200">
    <CardContent className="pt-4">
      <div className="flex items-start">
        <FaUser className="w-12 h-12 text-gray-600 mr-4" />
        <div className="flex-1">
          <h5 className="font-medium text-gray-800">{item.userId.name}</h5>
          <div className="flex items-center my-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="cursor-pointer">
                {i < item.rating ? (
                  <FaStar className="text-yellow-400 w-5 h-5" />
                ) : (
                  <FaRegStar className="text-yellow-400 w-5 h-5" />
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Comment At: {new Date(item.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-2 text-gray-600">{item.comment}</p>
          <div className="flex justify-end gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLikeOrDislike(item._id, "like")}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FaThumbsUp />
              <span>{item.likes ? item.likes.length : 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLikeOrDislike(item._id, "dislike")}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FaThumbsDown />
              <span>{item.dislikes ? item.dislikes.length : 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
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

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (isError) return <p className="text-center text-red-600">Error loading reviews.</p>;

  return (
    <section className="py-12 bg-white">
      <div className="w-80vw mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-blue-50 rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-medium text-gray-800">Reviewer Recommendation</CardTitle>
            <div className="text-4xl font-bold text-gray-900 my-4">{recommendationPercentage}%</div>
            <p className="text-base text-gray-600 opacity-75">
              Recommended by {reviews.length} reviewers.
            </p>
            <div className="flex justify-center items-center mt-2">
              <span className="text-lg text-gray-700">Average Rating: {averageRating}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="cursor-pointer">
                    {i < rating ? (
                      <FaStar
                        className="text-yellow-400 w-6 h-6"
                        onClick={() => setRating(i + 1)}
                      />
                    ) : (
                      <FaRegStar
                        className="text-yellow-400 w-6 h-6"
                        onClick={() => setRating(i + 1)}
                      />
                    )}
                  </span>
                ))}
              </div>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment"
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg resize-none"
              />
              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800 text-white"
              >
                Submit Review
              </Button>
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
              <p className="text-center text-gray-600">No reviews available for this product.</p>
            )}
            {visibleReviews < reviews.length && (
              <div className="text-center mt-6">
                <Button
                  onClick={loadMoreComments}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

ReviewSection.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ReviewSection;