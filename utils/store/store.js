import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cart";
import userReducer from "./reducers/user";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["./reducers/cart.js"],
      },
    }),
});

export default store;
