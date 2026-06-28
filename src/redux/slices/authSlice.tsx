import { createSlice } from "@reduxjs/toolkit";

import { sendNumberThunk } from "../thunks/sendNumberThunk";
import { sendOtpThunk } from "../thunks/sendOtpThunk";
import { completeRegister } from "../thunks/completeRegisterThunk";
import { sendNumberLoginThunk } from "../thunks/sendNumberLogin";
import { sendOtpLoginThunk } from "../thunks/sendOtpLogin";
import { updateProfileThunk } from "../thunks/updateProfileThunk";
import { refreshAccessTokenThunk } from "../thunks/refreshAccessTokenThunk";

//
import { resetPasswordPhoneThunk } from "../thunks/resetPasswordPhoneThunk";
import { resetPasswordOtpThunk } from "../thunks/resetPasswordOtpThunk";
import { resetPasswordThunk } from "../thunks/resetPasswordThunk";
//

import {
  clearStoredAuth,
  persistStoredAuth,
  readStoredAuth,
} from "../authStorage";

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

  refreshingToken: boolean;

  updateProfileThunk: boolean;
  updatingProfile: boolean;

  //
  //
  resetOtpSessionToken: string | null;
  resetPasswordToken: string | null;
  sendingResetPhone: boolean;
  verifyingResetOtp: boolean;
  resettingPassword: boolean;
  //
  //

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

  refreshingToken: false,

  updateProfileThunk: false,
  updatingProfile: false,

  //
  //
  resetOtpSessionToken: null,
  resetPasswordToken: null,
  sendingResetPhone: false,
  verifyingResetOtp: false,
  resettingPassword: false,

  //
  //

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

      state.sendingPhone = false;
      state.verifyingOtp = false;
      state.completingRegister = false;
      state.bootstrappingProfile = false;
      state.loading = false;
      state.refreshingToken = false;

      state.updateProfileThunk = false;
      state.updatingProfile = false;

      state.error = null;

      clearStoredAuth();
    },

    hydrateAuth: (state, action: { payload: StoredAuth }) => {
      state.access_token = action.payload.accessToken;
      state.refresh_token = action.payload.refreshToken;
      state.user = action.payload.user;

      persistStoredAuth({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      });
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
      state.refreshingToken = false;

      state.updateProfileThunk = false;
      state.updatingProfile = false;
    },

    resetPasswordFlow: (state) => {
      state.resetOtpSessionToken = null;
      state.resetPasswordToken = null;
      state.sendingResetPhone = false;
      state.verifyingResetOtp = false;
      state.resettingPassword = false;
      state.error = null;
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

        const accessToken = action.payload.access_token ?? state.access_token;
        const refreshToken =
          action.payload.refresh_token ?? state.refresh_token;
        const user = action.payload.user ?? state.user;

        state.access_token = accessToken;
        state.refresh_token = refreshToken;
        state.user = user;

        persistStoredAuth({
          accessToken,
          refreshToken,
          user,
        });
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

        persistStoredAuth({
          accessToken: action.payload.access_token,
          refreshToken: action.payload.refresh_token,
          user: action.payload.user,
        });
      })
      .addCase(sendOtpLoginThunk.rejected, (state, action) => {
        state.verifyingOtp = false;
        state.error = action.payload as string;
      })

      .addCase(refreshAccessTokenThunk.pending, (state) => {
        state.refreshingToken = true;
        state.error = null;
      })
      .addCase(refreshAccessTokenThunk.fulfilled, (state, action) => {
        state.refreshingToken = false;

        state.access_token = action.payload;

        persistStoredAuth({
          accessToken: action.payload,
          refreshToken: state.refresh_token,
          user: state.user,
        });
      })
      .addCase(refreshAccessTokenThunk.rejected, (state, action) => {
        state.refreshingToken = false;

        state.user = null;
        state.access_token = null;
        state.refresh_token = null;

        state.error =
          (action.payload as string) ??
          "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.";

        clearStoredAuth();
      })

      .addCase(updateProfileThunk.pending, (state) => {
        state.updateProfileThunk = false;
        state.updatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.updateProfileThunk = true;
        state.updatingProfile = false;

        state.user = {
          ...state.user,
          ...action.payload.user,
        };

        persistStoredAuth({
          accessToken: state.access_token,
          refreshToken: state.refresh_token,
          user: state.user,
        });
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.updateProfileThunk = false;
        state.updatingProfile = false;
        state.error = action.payload as string;
      })

      //
      //
      .addCase(resetPasswordPhoneThunk.pending, (state) => {
        state.sendingResetPhone = true; // not sendingPhone
        state.error = null;
      })
      .addCase(resetPasswordPhoneThunk.fulfilled, (state, action) => {
        state.sendingResetPhone = false;
        state.resetOtpSessionToken = action.payload.otp_session_token; // not otp_session_token
      })
      .addCase(resetPasswordPhoneThunk.rejected, (state, action) => {
        state.sendingResetPhone = false;
        state.error = action.payload as string;
      })
      //
      //

      //
      .addCase(resetPasswordOtpThunk.pending, (state) => {
        state.verifyingResetOtp = true;
        state.error = null;
      })
      .addCase(resetPasswordOtpThunk.fulfilled, (state, action) => {
        state.verifyingResetOtp = false;
        state.resetPasswordToken = action.payload.reset_token;
      })
      .addCase(resetPasswordOtpThunk.rejected, (state, action) => {
        state.verifyingResetOtp = false;
        state.error = action.payload as string;
      })
      //

      //
      //
      .addCase(resetPasswordThunk.pending, (state) => {
        state.resettingPassword = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.resettingPassword = false;
        state.resetOtpSessionToken = null;
        state.resetPasswordToken = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.resettingPassword = false;
        state.error = action.payload as string;
      });
    //
    //
  },
});

export const {
  hydrateAuth,
  resetAuth,
  resetAuthFlow,
  setBootstrappingProfile,
  resetPasswordFlow,
} = authSlice.actions;

export default authSlice.reducer;
