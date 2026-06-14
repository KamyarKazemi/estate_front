import { createSlice } from "@reduxjs/toolkit";
import { sendNumberThunk } from "../thunks/sendNumberThunk";
import { sendOtpThunk } from "../thunks/sendOtpThunk";
import { completeRegister } from "../thunks/completeRegisterThunk";

interface AuthState {
  phone_number: string | null;
  otp_session_token: string | null;
  registration_token: string | null;

  sendingPhone: boolean;
  verifyingOtp: boolean;
  completingRegister: boolean;
  bootstrappingProfile: boolean;
  loading: boolean;

  error: string | null;
}

const initialState: AuthState = {
  phone_number: null,
  otp_session_token: null,
  registration_token: null,

  sendingPhone: false,
  verifyingOtp: false,
  completingRegister: false,
  bootstrappingProfile: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => initialState,

    setBootstrappingProfile: (state, action: { payload: boolean }) => {
      state.bootstrappingProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNumberThunk.pending, (state) => {
        state.sendingPhone = true;
        state.error = null;
      })
      .addCase(sendNumberThunk.fulfilled, (state, action) => {
        state.sendingPhone = false;
        state.phone_number = action.payload.phone_number;
        state.otp_session_token = action.payload.otp_session_token;
      })
      .addCase(sendNumberThunk.rejected, (state, action) => {
        state.sendingPhone = false;
        state.error = action.payload as string;
      })

      .addCase(sendOtpThunk.pending, (state) => {
        state.verifyingOtp = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.verifyingOtp = false;
        state.registration_token = action.payload.registration_token;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.verifyingOtp = false;
        state.error = action.payload as string;
      })

      .addCase(completeRegister.pending, (state) => {
        state.completingRegister = true;
        state.error = null;
      })
      .addCase(completeRegister.fulfilled, (state) => {
        state.completingRegister = false;
      })
      .addCase(completeRegister.rejected, (state, action) => {
        state.completingRegister = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth, setBootstrappingProfile } = authSlice.actions;
export default authSlice.reducer;
