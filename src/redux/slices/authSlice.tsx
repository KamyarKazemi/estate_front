import { createSlice } from "@reduxjs/toolkit";
import { sendOtpThunk } from "../thunks/sentOtpThunk";

interface AuthState {
  phone_number: number | null;
  otp_session_token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  phone_number: null,
  otp_session_token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.phone_number = action.payload.phone_number;
        state.otp_session_token = action.payload.otp_session_token;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
