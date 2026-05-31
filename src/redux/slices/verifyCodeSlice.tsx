import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../error.js";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_SECOND;

export const verifyCodeThunk = createAsyncThunk(
  "verifyCode/verify",
  async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(URL, {
        otp_code,
        otp_session_token,
      });

      const data = res.data;

      const registration_token = data?.registration_token;
      if (!registration_token) {
        return rejectWithValue("registration_token not found in response.");
      }

      // optional: you can store this too if needed
      const is_registered = data?.is_registered;

      return { registration_token, is_registered, raw: data };
    } catch (err) {
      const data = err?.response?.data;
      return rejectWithValue(
        getErrorMessage(data, err?.message || "failed to verify code"),
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  registration_token: null,
  is_registered: null, // optional
};

const verifyCodeSlice = createSlice({
  name: "verifyCode",
  initialState,
  reducers: {
    resetVerifyCode(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registration_token = null;
      state.is_registered = null;
    },
    clearVerifyCodeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registration_token = action.payload.registration_token;
        state.is_registered = action.payload.is_registered ?? null;
      })
      .addCase(verifyCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "failed to verify code";
      });
  },
});

export const { resetVerifyCode, clearVerifyCodeError } =
  verifyCodeSlice.actions;
export default verifyCodeSlice.reducer;
