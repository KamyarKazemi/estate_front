import { createSlice } from "@reduxjs/toolkit";
import { sendNumberThunk } from "../thunks/sendNumberThunk";
import { sendOtpThunk } from "../thunks/sendOtpThunk";

interface AuthState {
  phone_number: string | null;
  otp_session_token: string | null;
  registration_token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  phone_number: null,
  otp_session_token: null,
  registration_token: null,
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
      .addCase(sendNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.phone_number = action.payload.phone_number;
        state.otp_session_token = action.payload.otp_session_token;
      })
      .addCase(sendNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.registration_token = action.payload.registration_token;
      })
      .addCase(sendOtpThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
