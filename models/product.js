import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ratingSchema = new Schema({
  fiveStar: {
    type: Number,
    default: 0,
    required: true,
  },

  fourStar: {
    type: Number,
    default: 0,
    required: true,
  },

  threeStar: {
    type: Number,
    default: 0,
    required: true,
  },

  twoStar: {
    type: Number,
    default: 0,
    required: true,
  },

  oneStar: {
    type: Number,
    default: 0,
    required: true,
  },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    numReviews: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numRatings: {
      type: ratingSchema,
      required: true,
    },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const User =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default User;
