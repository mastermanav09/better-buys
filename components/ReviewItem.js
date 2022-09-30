import React from "react";
import ReactStars from "react-rating-stars-component";
import { useState } from "react";

const ReviewItem = (props) => {
  const { name, comment, rating, createdAt } = props.review;
  const [showFullComment, setShowFullComment] = useState(false);

  const setShowFullCommentHandler = (value) => {
    setShowFullComment(value);
  };

  let updatedComment;
  if (comment?.length > 50) {
    updatedComment = comment.slice(0, 50);
    updatedComment += "...";
  } else {
    updatedComment = comment;
  }

  return (
    <li className="bg-gray-100 p-3 rounded-lg my-3">
      <article>
        <div className="flex items-center space-x-4">
          <div className="space-y-1 font-medium dark:text-white">
            <p>{name}</p>
          </div>
        </div>
        <div className="flex items-center pointer-events-none">
          <ReactStars
            key={rating}
            count={5}
            value={rating}
            size={32}
            activeColor="#ffd700"
          />
        </div>
        <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Reviewed on{" "}
            {new Date(createdAt)
              .toLocaleString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })
              .toString()}{" "}
          </p>
        </footer>
        <p className="mb-2 font-light text-gray-500 dark:text-gray-400">
          {showFullComment ? <>{comment}</> : <>{updatedComment}</>}
        </p>

        {updatedComment.length > 50 && (
          <button
            className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => {
              if (showFullComment) {
                setShowFullCommentHandler(false);
              } else {
                setShowFullCommentHandler(true);
              }
            }}
          >
            {showFullComment ? <>Close</> : <>Read more</>}
          </button>
        )}
      </article>
    </li>
  );
};

export default ReviewItem;
