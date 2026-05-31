import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../error.js";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_THIRD;

export const completeRegisterThunk = createAsyncThunk(
  "completeRegister/complete",
  async (
    {
      registration_token,
      first_name,
      last_name,
      email,
      role,
      password,
      cofirm_password,
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(URL, {
        registration_token,
        first_name,
        last_name,
        email,
        role,
        password,
        cofirm_password,
      });

      return { raw: res.data };
    } catch (err) {
      const data = err?.response?.data;
      return rejectWithValue(
        getErrorMessage(data, err?.message || "Failed to complete register"),
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const completeRegisterSlice = createSlice({
  name: "completeRegister",
  initialState,
  reducers: {
    resetCompleteRegister(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCompleteRegisterError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(completeRegisterThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(completeRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to complete register";
      });
  },
});

export const { resetCompleteRegister, clearCompleteRegisterError } =
  completeRegisterSlice.actions;

export default completeRegisterSlice.reducer;
