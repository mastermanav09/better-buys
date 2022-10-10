import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { postReview } from "../utils/store/reducers/product";
import LoadingSpinner from "./svg/LoadingSpinner";

const ReviewSubmitModal = (props) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);
  const dispatch = useDispatch();
  const { isPostReviewLoading } = useSelector((state) => state.product);

  const ratingChanged = (newRating) => {
    setRating(+newRating);
  };

  const reviewHandler = (event) => {
    setReview(event.target.value);
  };

  const submitReviewHandler = (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5 || !review || review.trim().length == 0) {
      window.alert("Please enter your rating and review!");
      return;
    }

    if (!review || review.trim().length < 3) {
      window.alert("Review should be of at least 3 characters!");
      return;
    }

    dispatch(
      postReview({
        rating: Number(rating),
        comment: review,
        productId: props.productId,
        setReviews: props.setReviews,
        setShowModal: props.setShowModal,
      })
    );
  };

  return (
    <>
      <div className="min-w-screen h-screen animated fadeIn faster fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div
          className="absolute bg-black opacity-80 inset-0 z-0"
          onClick={() => props.addReviewModalHandler(false)}
        ></div>
        <div className="w-[90%] md:w-full max-w-lg p-3 sm:p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
          <form onSubmit={submitReviewHandler}>
            <div className="text-center flex-auto justify-center">
              <h2 className="text-left text-xl">Leave your review</h2>
            </div>

            <div className="my-4">
              <div className="text-base my-3 flex gap-2">
                <span className="text-sm mt-[0.2rem] sm:block hidden">
                  Rate our product
                </span>
                <Rating
                  onClick={(event) => ratingChanged(event.target.value)}
                />
              </div>
              <div>
                <textarea
                  onChange={reviewHandler}
                  id="review"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
            </div>

            <div className="mt-4 text-center flex justify-between">
              <button
                className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs md:text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                onClick={() => props.addReviewModalHandler(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 md:text-sm text-xs shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
              >
                {isPostReviewLoading ? (
                  <LoadingSpinner className="mx-auto w-[3.2rem] h-4 text-green-400 animate-spin dark:text-purple-600 fill-white" />
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewSubmitModal;
