import { createSlice } from "@reduxjs/toolkit";
import { sendNumberThunk } from "../thunks/sendNumberThunk";
import { sendOtpThunk } from "../thunks/sendOtpThunk";
import { completeRegister } from "../thunks/completeRegisterThunk";
import { sendNumberLoginThunk } from "../thunks/sendNumberLogin";
import { sendOtpLoginThunk } from "../thunks/sendOtpLogin";
import { readStoredAuth } from "../authStorage";
import type { StoredAuth, UserProfile } from "../authStorage";

interface AuthState {
  user: UserProfile | null;
  access_token: string | null;
  refresh_token: string | null;

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

const storedAuth = readStoredAuth();

const initialState: AuthState = {
  user: storedAuth.user,
  access_token: storedAuth.accessToken,
  refresh_token: storedAuth.refreshToken,

  phone_number: null,
  otp_session_token: null,
  registration_token: null,

  sendingPhone: false,
  verifyingOtp: false,
  completingRegister: false,
  bootstrappingProfile: false,
  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.phone_number = null;
      state.otp_session_token = null;
      state.registration_token = null;
      state.error = null;
    },

    hydrateAuth: (state, action: { payload: StoredAuth }) => {
      state.access_token = action.payload.accessToken;
      state.refresh_token = action.payload.refreshToken;
      state.user = action.payload.user;
    },

    resetAuthFlow: (state) => {
      state.phone_number = null;
      state.otp_session_token = null;
      state.registration_token = null;
      state.error = null;
      state.sendingPhone = false;
      state.verifyingOtp = false;
      state.completingRegister = false;
      state.bootstrappingProfile = false;
      state.loading = false;
    },

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

      .addCase(sendNumberLoginThunk.pending, (state) => {
        state.sendingPhone = true;
        state.error = null;
      })
      .addCase(sendNumberLoginThunk.fulfilled, (state, action) => {
        state.sendingPhone = false;
        state.phone_number = action.payload.phone_number;
        state.otp_session_token = action.payload.otp_session_token;
      })
      .addCase(sendNumberLoginThunk.rejected, (state, action) => {
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
      .addCase(completeRegister.fulfilled, (state, action) => {
        state.completingRegister = false;

        if (action.payload.access_token) {
          state.access_token = action.payload.access_token;
        }

        if (action.payload.refresh_token) {
          state.refresh_token = action.payload.refresh_token;
        }

        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(completeRegister.rejected, (state, action) => {
        state.completingRegister = false;
        state.error = action.payload as string;
      })

      .addCase(sendOtpLoginThunk.pending, (state) => {
        state.verifyingOtp = true;
        state.error = null;
      })
      .addCase(sendOtpLoginThunk.fulfilled, (state, action) => {
        state.verifyingOtp = false;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.user = action.payload.user;
      })
      .addCase(sendOtpLoginThunk.rejected, (state, action) => {
        state.verifyingOtp = false;
        state.error = action.payload as string;
      });
  },
});

export const { hydrateAuth, resetAuth, resetAuthFlow, setBootstrappingProfile } =
  authSlice.actions;
export default authSlice.reducer;
