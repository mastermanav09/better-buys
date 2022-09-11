import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";
import orderReducer from "./reducers/order";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["./reducers/cart.js"],
      },
    }).concat(),
});

export default store;
