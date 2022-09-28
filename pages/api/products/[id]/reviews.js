import db from "../../../../utils/db";
import { getSession } from "next-auth/react";
import Product from "../../../../models/product";
import mongoose from "mongoose";

const ratingsMap = {
  1: "oneStar",
  2: "twoStar",
  3: "threeStar",
  4: "fourStar",
  5: "fiveStar",
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Sign in required!" });
  }

  const { user } = session;
  if (req.method === "GET") {
    return await getHandler(req, res, user);
  } else if (req.method === "POST") {
    return await postHandler(req, res, user);
  }
};

const getHandler = async (req, res, user) => {
  try {
    await db.connect();
    const product = await Product.findById(req.query.id, {
      reviews: { $slice: 5 },
    });

    if (!product) {
      const error = new Error("Product not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(product.reviews);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: "Something went wrong!" });
  }
};

const postHandler = async (req, res, user) => {
  try {
    await db.connect();
    const rating = Math.round(Number(req.body.rating));
    const product = await Product.findById(req.query.id);
    const review = req.body.comment;

    if (rating < 1 || rating > 5) {
      const error = new Error("Rating not allowed!");
      error.statusCode = 400;
      throw error;
    }

    if (review.trim().length < 3) {
      const error = new Error("Review should be of at least 3 characters!");
      error.statusCode = 400;
      throw error;
    }

    if (!product) {
      const error = new Error("Product not found!");
      error.statusCode = 404;
      throw error;
    }

    const existReview = product.reviews.find(
      (review) => review.user.toString() === user._id.toString()
    );

    let resMessage = "";
    let statusCode = 200;

    if (existReview) {
      await Product.updateOne(
        {
          _id: req.query.id,
          "reviews._id": existReview._id,
        },
        {
          $set: {
            "reviews.$.comment": review,
            "reviews.$.rating": rating,
          },
        }
      );

      product.numRatings[ratingsMap[existReview.rating]]--;
      product.numRatings[ratingsMap[rating]]++;

      resMessage = "Review updated.";
      statusCode = 204;
    } else {
      const newReview = {
        user: mongoose.Types.ObjectId(user._id),
        name: user.name,
        rating: rating,
        comment: review,
      };

      product.numRatings[ratingsMap[rating]]++;
      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;

      await product.save();
      resMessage = "Review submitted.";
      statusCode = 201;
    }

    const totalRatings =
      product.numRatings.fiveStar +
      product.numRatings.fourStar +
      product.numRatings.threeStar +
      product.numRatings.twoStar +
      product.numRatings.oneStar;

    let updatedRating =
      (product.numRatings.fiveStar * 5 +
        product.numRatings.fourStar * 4 +
        product.numRatings.threeStar * 3 +
        product.numRatings.twoStar * 2 +
        product.numRatings.oneStar) /
      totalRatings;

    updatedRating = updatedRating.toPrecision(1);
    updatedRating = Math.min(5, updatedRating);
    updatedRating = Math.max(0, updatedRating);

    product.rating = updatedRating;

    await product.save();
    res.status(statusCode).json({ message: resMessage });
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong!" });
  }
};

export default handler;
