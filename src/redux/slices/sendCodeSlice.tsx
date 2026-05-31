import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getErrorMessage } from "../error.js";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_FIRST;

export const sendCodeThunk = createAsyncThunk(
  "sendCode/send",
  async ({ phone_number }, { rejectWithValue }) => {
    try {
      const res = await axios.post(URL, { phone_number });
      const data = res.data;

      const otp_session_token = data?.otp_session_token;
      if (!otp_session_token) {
        return rejectWithValue("otp_session_token not found in response.");
      }

      return { otp_session_token, raw: data };
    } catch (err) {
      const data = err?.response?.data;
      return rejectWithValue(
        getErrorMessage(data, err?.message || "failed to send code."),
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  otp_session_token: null,
};

const sendCodeSlice = createSlice({
  name: "sendCode",
  initialState,
  reducers: {
    resetSendCode(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otp_session_token = null;
    },
    clearSendCodeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.otp_session_token = action.payload.otp_session_token;
      })
      .addCase(sendCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "failed to send code";
      });
  },
});

export const { resetSendCode, clearSendCodeError } = sendCodeSlice.actions;
export default sendCodeSlice.reducer;
