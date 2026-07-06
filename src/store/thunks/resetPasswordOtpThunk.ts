import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_RESET_OTP;

interface ResetOtpPayload {
  otp_session_token: string;
  otp_code: string;
}

interface ResetOtpResponse {
  otp_session_token: string;
  reset_token: string;
}

export const resetPasswordOtpThunk = createAsyncThunk<
  ResetOtpResponse,
  ResetOtpPayload,
  { rejectValue: string }
>("resetPassword/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(ENDPOINT, payload);
    return {
      otp_session_token: payload.otp_session_token,
      reset_token: response.data.reset_token,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "تأیید کد ناموفق بود.")
    );
  }
});
