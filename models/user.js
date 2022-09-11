import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    credentials: {
      name: {
        type: String,
        required: true,
        min: 3,
      },

      email: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
        min: 6,
      },

      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    },

    shippingAddress: {
      fullName: {
        type: String,
      },

      address: {
        type: String,
      },

      city: {
        type: String,
      },

      state: {
        type: String,
      },

      postalCode: {
        type: Number,
      },
    },

    paymentMethod: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
