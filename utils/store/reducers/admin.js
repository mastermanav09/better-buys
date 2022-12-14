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

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get("/api/admin/users");
      dispatch(adminActions.fetchUsersSuccess(data));
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const fetchUser = createAsyncThunk(
  "admin/fetchUser",
  async ({ userId, setValue }, { dispatch }) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get(`/api/admin/users/${userId}`);
      setValue("name", data.credentials.name);
      setValue("isAdmin", data.credentials.isAdmin);

      dispatch(adminActions.fetchUserSuccess(data));
    } catch (error) {
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "admin/fetchProduct",
  async (
    {
      productId,
      setValue,
      router,
      setIsFeatured,
      setSelectedImage,
      setFeaturedSelectedImage,
    },
    { dispatch }
  ) => {
    try {
      dispatch(adminActions.fetchRequest());
      const { data } = await axios.get(`/api/admin/products/${productId}`);
      dispatch(adminActions.fetchProductSuccess(data));

      setValue("name", data.name);
      setValue("slug", data.slug);
      setValue("price", data.price);
      setValue("image", data.image);
      setSelectedImage(data.image);
      setValue("category", data.category);
      setValue("brand", data.brand);
      setValue("countInStock", data.countInStock);
      setValue("description", data.description);
      setValue("isFeatured", data.isFeatured);
      setValue("featuredImage", data.featuredImage);
      if (data.isFeatured) {
        setFeaturedSelectedImage(data.featuredImage);
      }
      setIsFeatured(data.isFeatured);
    } catch (error) {
      router.replace("/error");
      dispatch(adminActions.fetchFail(getError(error)));
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async ({ router }, { dispatch }) => {
    toast.clearWaitingQueue();

    try {
      dispatch(adminActions.createRequest());
      const { data } = await axios.post("/api/admin/products");
      dispatch(adminActions.createSuccess());

      router.push(`/admin/product/${data.product._id}`);
      toast.success("Product created successfully!");
    } catch (error) {
      dispatch(adminActions.createFail());
      toast.error(getError(error));
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

      dispatch(adminActions.updateSuccess());
      toast.success("Product update successfully!");
      router.push("/admin/products");
    } catch (error) {
      dispatch(adminActions.updateFail(getError(error)));
      toast.error(getError(error));
    }
  }
);

export const editUser = createAsyncThunk(
  "admin/editUser",
  async ({ userId, userData, router }, { dispatch }) => {
    toast.clearWaitingQueue();
    try {
      dispatch(adminActions.updateRequest());
      const { data } = await axios.put(`/api/admin/users/${userId}`, {
        ...userData,
      });

      dispatch(adminActions.updateSuccess());
      toast.success("User updated successfully!");
      router.push("/admin/users");
    } catch (error) {
      dispatch(adminActions.updateFail(getError(error)));
      toast.error(getError(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { dispatch }) => {
    toast.clearWaitingQueue();

    try {
      dispatch(adminActions.deleteRequest(productId));
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch(adminActions.deleteSuccess());

      toast.success("Product deleted successfully!");
    } catch (error) {
      dispatch(adminActions.deleteFail());
      toast.error(getError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { dispatch }) => {
    toast.clearWaitingQueue();

    try {
      dispatch(adminActions.deleteRequest(userId));
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch(adminActions.deleteSuccess());

      toast.success("User deleted successfully!");
    } catch (error) {
      dispatch(adminActions.deleteFail());
      toast.error(getError(error));
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  "admin/uploadProductImage",
  async (
    {
      selectedImage,
      selectedFeaturedImage,
      setValue,
      isFeaturedImage,
      setLoadingFeaturedImageUpload,
    },
    { dispatch }
  ) => {
    toast.clearWaitingQueue();

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {
      if (setLoadingFeaturedImageUpload) {
        setLoadingFeaturedImageUpload(true);
      } else {
        dispatch(adminActions.uploadRequest());
      }

      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");

      const formData = new FormData();
      if (isFeaturedImage) {
        formData.append("file", selectedFeaturedImage);
      } else {
        formData.append("file", selectedImage);
      }
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

      const { data } = await axios.post(url, formData);

      dispatch(adminActions.uploadSuccess());
      if (isFeaturedImage) {
        setValue("featuredImage", data.secure_url);
      } else {
        setValue("image", data.secure_url);
      }

      toast.success("File uploaded successfully!");
    } catch (error) {
      dispatch(adminActions.uploadFail(getError(error)));
      toast.error(getError(error));
    }

    setLoadingFeaturedImageUpload(false);
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
      toast.success("Order is on its way!");
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
    users: [],

    currentProduct: null,
    currentUser: null,

    loadingUpdate: false,
    errorUpdate: false,

    loadingUpload: false,
    errorUpload: null,

    loadingCreate: false,

    loadingDelete: false,
    successDelete: null,

    ui: {
      showAdminSidebar: false,
    },
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
      state.loadingUpdate = true;
      state.errorUpdate = "";
    },

    updateSuccess(state, action) {
      state.loadingUpdate = false;
      state.errorUpdate = "";
    },

    updateFail(state, action) {
      state.loadingUpdate = false;
      state.errorUpdate = action.payload;
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

    createRequest(state, action) {
      state.loadingCreate = true;
    },

    createSuccess(state, action) {
      state.loadingCreate = false;
    },

    createFail(state, action) {
      state.loadingCreate = false;
    },

    deleteRequest(state, action) {
      state.loadingDelete = action.payload;
    },

    deleteSuccess(state, action) {
      state.loadingDelete = false;
      state.successDelete = true;
    },

    deleteFail(state, action) {
      state.loadingDelete = false;
      state.successDelete = null;
    },

    deleteReset(state, action) {
      state.loadingDelete = false;
      state.successDelete = null;
    },

    fetchUsersSuccess(state, action) {
      state.users = action.payload;
      state.isLoading = false;
    },

    fetchUserSuccess(state, action) {
      state.isLoading = false;
      state.currentUser = action.payload;
    },

    toggleSidebar(state, action) {
      state.ui.showAdminSidebar = action.payload;
    },
  },
});

export default adminSlice.reducer;
export const adminActions = adminSlice.actions;
