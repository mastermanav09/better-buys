import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getError } from "../../error";
import axios from "axios";
import { toast } from "react-toastify";
import { orderActions } from "./order";

export const fetchSummary = createAsyncThunk(
  "admin/fetchSummary",
  async (_, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get("/api/admin/summary");
      dispatch(adminActions.fetchSummarySuccess(data));
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get("/api/admin/orders");
      dispatch(adminActions.fetchOrdersSuccess(data));
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get("/api/admin/products");
      dispatch(adminActions.fetchProductsSuccess(data));
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "admin/fetchProduct",
  async ({ productId, setValue }, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get(`/api/admin/products/${productId}`);
      dispatch(adminActions.fetchProductSuccess(data));
      setValue("name", data.name);
      setValue("slug", data.slug);
      setValue("price", data.price);
      setValue("image", data.image);
      setValue("category", data.category);
      setValue("brand", data.brand);
      setValue("countInStock", data.countInStock);
      setValue("description", data.description);
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const editProduct = createAsyncThunk(
  "admin/editProduct",
  async ({ productId, productData, router }, { dispatch }) => {
    toast.clearWaitingQueue();
    try {
      dispatch(adminActions.updateRequest());
      const { data } = await axios.put(`/api/admin/products/${productId}`, {
        ...productData,
      });

      dispatch(adminActions.updateProductSuccess(data));
      toast.success("Product update successfully!");
      router.push("/admin/products");
    } catch (error) {
      dispatch(adminActions.updateFail(getError(error)));
      toast.error(getError(error));
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  "admin/uploadProductImage",
  async ({ selectedImage, setValue }, { dispatch }) => {
    toast.clearWaitingQueue();

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {
      dispatch(adminActions.uploadRequest());

      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");

      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

      const { data } = await axios.post(url, formData);
      dispatch(adminActions.uploadSuccess());

      setValue("image", data.secure_url);
      toast.success("File uploaded successfully!");
    } catch (error) {
      dispatch(adminActions.uploadFail(getError(error)));
      toast.error(getError(error));
    }
  }
);

export const deliverOrder = createAsyncThunk(
  "admin/deliverOrder",
  async ({ orderId }, { dispatch }) => {
    toast.clearWaitingQueue();

    try {
      dispatch(orderActions.deliverRequest());

      const { data } = await axios({
        url: `/api/admin/orders/${orderId}/deliver`,
        method: "PUT",
        data: {},
      });

      dispatch(orderActions.deliverSuccess(data));
      toast.success("Order is delivered!");
    } catch (error) {
      dispatch(orderActions.deliverFail(getError(error)));
      toast.error("Couldn't deliver order.");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isLoading: false,
    error: "",
    summary: { salesData: [] },
    orders: [],
    products: [],
    currentProduct: null,
    loadingProductUpdate: false,
    errorProductUpdate: false,
    loadingUpload: false,
    errorUpload: null,
  },

  reducers: {
    nullifyErrors(state, action) {
      state.error = "";
      state.errorProductUpdate = false;
    },

    fetchRequest(state, action) {
      state.isLoading = true;
      state.error = "";
    },

    fetchSummarySuccess(state, action) {
      state.isLoading = false;
      state.summary = action.payload;
      state.error = "";
    },

    fetchOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload;
      state.error = "";
    },

    fetchProductSuccess(state, action) {
      state.currentProduct = action.payload;
      state.isLoading = false;
      state.error = "";
    },

    fetchProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
      state.error = "";
    },

    fetchFail(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateRequest(state, action) {
      state.loadingProductUpdate = true;
      state.errorProductUpdate = "";
    },

    updateProductSuccess(state, action) {
      state.loadingProductUpdate = false;
      state.errorProductUpdate = "";
    },

    updateFail(state, action) {
      state.loadingProductUpdate = false;
      state.errorProductUpdate = action.payload;
    },

    uploadRequest(state, action) {
      state.loadingUpload = true;
      state.errorUpload = null;
    },

    uploadSuccess(state, action) {
      state.loadingUpload = false;
      state.errorUpload = null;
    },

    uploadFail(state, action) {
      state.loadingUpload = false;
      state.errorUpload = action.payload;
    },
  },
});

export default adminSlice.reducer;
export const adminActions = adminSlice.actions;
