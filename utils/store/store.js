import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";
import orderReducer from "./reducers/order";
import adminReducer from "./reducers/admin";
import productReducer from "./reducers/product";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    admin: adminReducer,
    product: productReducer,
  },

  devTools: process.env.NODE_ENV === "production" ? false : true,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["./reducers/cart.js"],
      },
    }).concat(),
});

export default store;
