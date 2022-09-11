import { createSlice } from "@reduxjs/toolkit";
const Cookie = require("js-cookie");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")) : [],
  },

  reducers: {
    addItem(state, action) {
      const newItem = action.payload.product;

      if (Array.isArray(state.cartItems)) {
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
      } else {
        toast.error("Cart items do not match!");
      }
    },

    removeItem(state, action) {
      if (Array.isArray(state.cartItems)) {
        const cartItems = state.cartItems.filter(
          (item) => item.slug !== action.payload.slug
        );

        Cookie.set("cart", JSON.stringify(cartItems));
        state.cartItems = cartItems;
      } else {
        toast.error("Cart items do not match!");
      }
    },

    resetCart(state, action) {
      state.cartItems = [];
    },

    resetUserOrderDetails(state, action) {
      state.paymentMethod = "";
      state.shippingAddress = {
        location: {},
      };
    },
  },
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;
