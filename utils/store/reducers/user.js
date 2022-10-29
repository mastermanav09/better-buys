import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import { getError } from "../../error";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { cartActions } from "./cart";

const haveSameData = function (obj1, obj2) {
  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;

  if (obj1Length === obj2Length) {
    return Object.keys(obj1).every(
      (key) =>
        obj2.hasOwnProperty(key) &&
        obj2[key] === obj1[key] &&
        obj2[key] !== null
    );
  }
  return false;
};

export const login = createAsyncThunk("user/login", async (data) => {
  const email = data.email;
  const password = data.password;

  data.setIsLoading(true);

  try {
    toast.clearWaitingQueue();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      throw new Error(res.error);
    }
  } catch (error) {
    toast.clearWaitingQueue();
    toast.error(getError(error));
  }

  data.setIsLoading(false);
});

export const signup = createAsyncThunk("user/signup", async (data) => {
  const email = data.email;
  const password = data.password;
  const name = data.username;

  data.setIsLoading(true);

  try {
    if (!email || !password || !name) {
      throw new Error("Credentials required!");
    }

    toast.clearWaitingQueue();

    await axios.post("/api/auth/signup", {
      name,
      email,
      password,
    });

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      throw new Error(res.error);
    }

    data.router.replace("/");
  } catch (error) {
    toast.clearWaitingQueue();
    toast.error(getError(error));
  }

  data.setIsLoading(false);
});

export const setUserDetails = createAsyncThunk(
  "user/setUserDetails",
  async (data, { getState, dispatch }) => {
    try {
      const { data: res } = await axios({
        method: "GET",
        url: "/api/details/getUserDetails",
      });

      dispatch(userSlice.actions.setUser(res));
    } catch (error) {
      if (error || error.message) {
        toast.error(getError(error));
      }
    }
  }
);

export const saveShippingAddress = createAsyncThunk(
  "user/saveShippingAddress",
  async (data, { getState, dispatch }) => {
    const state = getState();
    const userShippingAddress = state.user.shippingAddress;

    data.setIsLoading(true);

    if (haveSameData(userShippingAddress, data.userShippingdata)) {
      data.router.push("/payment");
      return;
    }

    try {
      const { data: res } = await axios({
        method: "POST",
        url: "/api/details/setShippingAddress",
        data: data.userShippingdata,
      });

      dispatch(userSlice.actions.saveShippingAddress(res));
      data.router.push("/payment");
    } catch (error) {
      toast.error(getError(error));
      toast.clearWaitingQueue();
    }

    data.setIsLoading(false);
  }
);

export const savePaymentMethod = createAsyncThunk(
  "user/savePaymentMethod",
  async (data, { getState, dispatch }) => {
    const state = getState();
    const userPaymentMethod = state.user.paymentMethod;

    if (data !== "" && userPaymentMethod === data) {
      return;
    }

    data.setIsLoading(true);
    try {
      const { data: res } = await axios({
        method: "POST",
        url: "/api/details/setPaymentMethod",
        data: {
          method: data.paymentMethod,
        },
      });

      dispatch(userSlice.actions.savePaymentMethod(res.paymentMethod));
      data.router.push("/placeorder");
    } catch (error) {
      toast.clearWaitingQueue();
      toast.error(getError(error));
    }

    data.setIsLoading(false);
  }
);

export const placeOrder = createAsyncThunk(
  "user/placeOrder",
  async ({ shippingData, setIsLoading, router }, { dispatch }) => {
    try {
      setIsLoading(true);

      if (
        shippingData.paymentMethod !== "Paytm" &&
        shippingData.paymentMethod !== "Cash On Delivery"
      ) {
        const error = new Error("Invalid payment method!");
        throw error;
      }

      const { data: res } = await axios({
        method: "POST",
        url: "/api/orders/",
        data: {
          orderItems: shippingData.orderItems,
          shippingAddress: shippingData.userShippingdata,
          paymentMethod: shippingData.paymentMethod,
          itemsPrice: shippingData.itemsPrice,
          shippingPrice: shippingData.shippingPrice,
          taxPrice: shippingData.taxPrice,
          totalPrice: shippingData.totalPrice,
        },
      });

      const redirectUser = async () => {
        return new Promise((resolve, reject) => {
          router.push(`/orders/${res._id}`);
          resolve();
        });
      };

      await redirectUser().then(() =>
        setTimeout(() => {
          dispatch(cartActions.resetCart());
        }, 1500)
      );

      Cookies.remove("cart");
    } catch (error) {
      toast.clearWaitingQueue();
      toast.error(getError(error));
    }

    setIsLoading(false);
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userData, setIsLoading }, { dispatch }) => {
    setIsLoading(true);
    try {
      await axios({
        method: "PUT",
        url: "/api/auth/update",
        data: userData,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: userData.email,
        password: userData.password,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.clearWaitingQueue();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.clearWaitingQueue();
      toast.error(getError(error));
    }

    setIsLoading(false);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    credentials: {},
    shippingAddress: {},
    paymentMethod: "",
    ui: {
      showSidebar: false,
      showFilterSidebar: false,
    },
  },

  reducers: {
    setUser(state, action) {
      state.credentials = action.payload.credentials;

      const isShippingDataPresent = Object.values(
        action.payload.shippingAddress
      ).every((val) => val !== null);

      if (isShippingDataPresent) {
        state.shippingAddress = action.payload.shippingAddress;
      } else {
        state.shippingAddress = {};
      }

      state.paymentMethod = action.payload.paymentMethod;
    },

    saveShippingAddress(state, action) {
      state.shippingAddress = {
        ...state.shippingAddress,
        ...action.payload,
      };
    },

    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },

    toggleSidebar(state, action) {
      state.ui.showSidebar = action.payload;
    },

    toggleFilterSidebar(state, action) {
      state.ui.showFilterSidebar = action.payload;
    },
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
