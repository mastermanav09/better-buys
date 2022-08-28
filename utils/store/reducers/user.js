import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import { getError } from "../../error";
import { toast } from "react-toastify";

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

    if (res.error) {
      throw new Error(res.error);
    }
  } catch (error) {
    toast.error(getError(error));
    toast.clearWaitingQueue();
  }

  data.setIsLoading(false);
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    credentials: {},
  },

  reducers: {
    setUser(state, action) {},
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
