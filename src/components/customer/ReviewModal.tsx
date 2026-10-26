import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface Props {
  order: Order;
  onClose: () => void;
}

export const ReviewModal: React.FC<Props> = ({ order, onClose }) => {
  const { rateOrder } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Prevent review on incomplete orders
  if (order.orderStatus !== 'delivered') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-3">
          <p className="text-sm font-bold text-stone-800">Order Still In Progress</p>
          <p className="text-xs text-stone-500">
            You can only review and rate your meal once it has been delivered to your doorstep.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    rateOrder(order.id, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl p-6 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-[#222222]">Rate Your Meal</h3>
            <p className="text-xs text-stone-500">{order.restaurant.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-[#222222]">Review Published!</h4>
            <p className="text-xs text-stone-500">
              Thank you for sharing your feedback with the restaurant and community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Star Rating Selector */}
            <div className="text-center py-2">
              <p className="text-xs font-semibold text-stone-600 mb-2">How was your experience?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-amber-600 mt-1">
                {rating === 5 && 'Outstanding! Delicious food & quick delivery'}
                {rating === 4 && 'Very Good! Satisfied with the meal'}
                {rating === 3 && 'Average experience'}
                {rating === 2 && 'Below expectation'}
                {rating === 1 && 'Poor experience'}
              </p>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Review & Food Notes
              </label>
              <textarea
                rows={3}
                placeholder="How was the flavor, temperature, packaging, and rider arrival?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
