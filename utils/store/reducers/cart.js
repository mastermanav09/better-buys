import { createSlice } from "@reduxjs/toolkit";
const Cookie = require("js-cookie");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")) : [],
    shippingAddress: {
      location: {},
    },
    paymentMethod: "",
  },

  reducers: {
    addItem(state, action) {
      const newItem = action.payload.product;

      const existingItem = state.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      const updatedCartItems = existingItem
        ? state.cartItems.map((item) =>
            item.name === existingItem.name ? newItem : item
          )
        : [...state.cartItems, newItem];

      Cookie.set("cart", JSON.stringify(updatedCartItems));
      state.cartItems = updatedCartItems;
    },

    removeItem(state, action) {
      const cartItems = state.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      Cookie.set("cart", JSON.stringify(cartItems));
      state.cartItems = cartItems;
    },

    resetCart(state, action) {
      state.cartItems = [];
      state.paymentMethod = "";
      state.shippingAddress = {
        location: {},
      };
    },
  },
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;
