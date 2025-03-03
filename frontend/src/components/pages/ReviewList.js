import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../slices/ReviewSlice';

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch();
  const { items: reviews } = useSelector((state) => state.reviews);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert productId to integer
    const reviewData = {
      product: parseInt(productId),
      rating: parseInt(newReview.rating),
      comment: newReview.comment
    };
  
    dispatch(createReview(reviewData))
      .unwrap()
      .then(() => {
        setNewReview({ rating: 5, comment: '' });
      })
      .catch((error) => {
        console.error('Review submission failed:', error);
      });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Product Reviews</h3>
      
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center mb-2">
          <label className="mr-2">Rating:</label>
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            className="border rounded p-1"
          >
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>{num} Stars</option>
            ))}
          </select>
        </div>
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          placeholder="Write your review..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews
          .filter(review => review.product === productId)
          .map(review => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold">{review.user}</span>
                <span className="ml-2 text-yellow-500">
                  {'★'.repeat(review.rating)}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewList;