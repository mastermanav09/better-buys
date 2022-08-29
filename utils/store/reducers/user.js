import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import { getError } from "../../error";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

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

export const auth = createAsyncThunk("user/auth", async (data) => {
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

    console.log(res);
    if (res.error) {
      throw new Error(res.error);
    }
  } catch (error) {
    console.log(error);
    toast.error(getError(error));
    toast.clearWaitingQueue();
  }

  data.setIsLoading(false);
});

export const saveShippingAddress = createAsyncThunk(
  "user/saveShippingAddress",
  async (data, { getState }) => {
    const state = getState();
    const userShippingAddress = state.user.shippingAddress;

    if (haveSameData(userShippingAddress, data.userShippingdata)) {
      return;
    }

    const token = Cookies.get("next-auth.session-token");

    // data.setIsLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: "/api/details/shippingAddress",
        data: data.userShippingdata,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // userActions.saveShippingAddress(data.userShippingdata);
    } catch (error) {
      console.log(error);
    }

    // data.setIsLoading(false);
  }
);

export const savePaymentMethod = createAsyncThunk(
  "user/savePaymentMethod",
  async (data, { getState }) => {
    const state = getState();
    const userPaymentMethod = state.user.paymentMethod;

    if (data.paymentMethod !== "" && userPaymentMethod === data.paymentMethod) {
      return;
    }

    const token = Cookies.get("next-auth.session-token");

    // data.setIsLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: "/api/details/paymentMethod",
        data: data.paymentMethod,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // userActions.saveShippingAddress(data.userShippingdata);
    } catch (error) {
      console.log(error);
    }

    // data.setIsLoading(false);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    credentials: {},
    shippingAddress: {},
    paymentMethod: "",
  },

  reducers: {
    setUser(state, action) {},

    saveShippingAddress(state, action) {
      state.shippingAddress = {
        ...state.shippingAddress,
        ...action.payload,
      };
    },

    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
