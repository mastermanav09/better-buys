import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../error";

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (data, { dispatch }) => {
    try {
      dispatch(orderSlice.actions.fetchOrderRequest());

      const { data: res } = await axios.get(`/api/orders/${data.orderId}`);
      dispatch(orderSlice.actions.fetchSuccess(res));
    } catch (error) {
      dispatch(orderSlice.actions.fetchFail(getError(error)));
    }
  }
);

export const initiatePayment = createAsyncThunk(
  "order/initiatePayment",
  async ({ orderData, router }, { dispatch }) => {
    try {
      dispatch(orderActions.payRequest());

      const { data: res, status } = await axios({
        method: "POST",
        url: "/api/orders/preTransaction",
        data: {
          orderItems: orderData.orderItems,
          userId: orderData.userId,
          totalPrice: orderData.totalPrice,
          orderId: orderData.orderId,
          paymentMethod: orderData.paymentMethod,
        },
      });

      if (status === 401) {
        router.replace("/login");
        return;
      }

      if (res.success) {
        var config = {
          root: "",
          flow: "DEFAULT",

          data: {
            orderId: orderData.orderId,
            token: res.txnToken,
            tokenType: "TXN_TOKEN",
            amount: orderData.totalPrice,
          },
          handler: {
            notifyMerchant: function (eventName, data) {
              // console.log("notifyMerchant handler function called");
              // console.log("eventName => ", eventName);
            },
          },
        };

        if (res.success) {
          window.Paytm.CheckoutJS.init(config)
            .then(function onSuccess() {
              window.Paytm.CheckoutJS.invoke();
            })
            .then(() => {
              dispatch(orderActions.paySuccess());
            })
            .catch(function onError(error) {
              dispatch(orderActions.payFailure());
              toast.error("Payment declined!");
            });
        }
      } else {
        toast.error("Payment declined!");
      }
    } catch (error) {
      dispatch(orderActions.payFailure());
      toast.clearWaitingQueue();
      toast.error(getError(error));
    }
  }
);

export const fetchOrdersHistory = createAsyncThunk(
  "order/fetchOrdersHistory",
  async ({ setIsLoading }, { dispatch }) => {
    dispatch(orderActions.setErrorNull());
    setIsLoading(true);

    try {
      const { data: res } = await axios.get("/api/orders/history");
      dispatch(orderActions.setAllOrders(res.orders));
    } catch (error) {
      dispatch(orderActions.fetchFail(getError(error)));
    }

    setIsLoading(false);
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: true,
    order: {},
    allOrders: [],
    error: "",
    loadingPay: null,
    successPay: null,
    errorPay: null,
    loadingDeliver: null,
    successDeliver: null,
  },

  reducers: {
    fetchOrderRequest(state, action) {
      state.loading = true;
      state.error = "";
      state.order = {};
    },

    fetchSuccess(state, action) {
      state.loading = false;
      state.order = action.payload;
      state.error = "";
    },

    fetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.order = {};
    },

    payRequest(state, action) {
      state.loadingPay = true;
    },

    paySuccess(state, action) {
      state.loadingPay = false;
      state.successPay = true;
    },

    payFailure(state, action) {
      state.errorPay = action.payload;
      state.loadingPay = false;
    },

    payReset(state, action) {
      state.loadingPay = false;
      state.successPay = false;
      state.errorPay = null;
    },

    setAllOrders(state, action) {
      state.allOrders = action.payload;
    },

    setErrorNull(state, action) {
      state.error = "";
    },

    deliverRequest(state, action) {
      state.loadingDeliver = true;
    },

    deliverSuccess(state, action) {
      state.loadingDeliver = false;
      state.successDeliver = true;
    },

    deliverFail(state, action) {
      state.loadingDeliver = false;
    },

    deliverReset(state, action) {
      state.loadingDeliver = false;
      state.successDeliver = false;
    },
  },
});

export default orderSlice.reducer;
export const orderActions = orderSlice.actions;
