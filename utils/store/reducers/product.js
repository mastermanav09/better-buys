import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getError } from "../../error";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchReviews = createAsyncThunk(
  "admin/fetchReviews",
  async ({ productId, setReviews, setShowModal }, { dispatch }) => {
    toast.clearWaitingQueue();

    try {
      dispatch(productActions.fetchRequest());
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
      dispatch(productActions.fetchReviewsSuccess());

      if (setShowModal) {
        setShowModal(false);
        dispatch(productActions.postReviewSuccess());
      }
    } catch (error) {
      dispatch(productActions.fetchFail(getError(error)));
      toast.error(getError(error));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async ({ setCategories }) => {
    toast.clearWaitingQueue();

    try {
      const { data } = await axios.get("/api/products/categories");
      setCategories(data);
    } catch (error) {
      toast.error(getError(error));
    }
  }
);

export const postReview = createAsyncThunk(
  "admin/postReview",
  async (
    { rating, comment, productId, setReviews, setShowModal },
    { dispatch }
  ) => {
    toast.clearWaitingQueue();

    try {
      dispatch(productActions.postRequest());
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment,
      });

      toast.success("Review added successfully!");
      dispatch(fetchReviews({ productId, setReviews, setShowModal }));
    } catch (error) {
      dispatch(productActions.postFail(getError(error)));
      toast.error("Something went wrong!");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    isPostReviewLoading: false,
    isLoading: false,
    error: "",
  },

  reducers: {
    fetchRequest(state, action) {
      state.isLoading = true;
      state.error = "";
    },

    fetchReviewsSuccess(state, action) {
      state.isLoading = false;
      state.currentProductReviews = action.payload;
      state.error = "";
    },

    fetchFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    postRequest(state, action) {
      state.isPostReviewLoading = true;
      state.error = "";
    },

    postReviewSuccess(state, action) {
      state.isPostReviewLoading = false;
      state.error = "";
    },

    postFail(state, action) {
      state.isPostReviewLoading = false;
      state.error = action.payload;
    },
  },
});

export default productSlice.reducer;
export const productActions = productSlice.actions;
