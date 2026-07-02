import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_REGISTER_SECOND;

interface VerifyPayload {
  otp_code: string;
  otp_session_token: string;
}

interface VerifyOtpResponse {
  registration_token: string;
}

export const sendOtpThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyPayload,
  { rejectValue: string }
>("register/verifyOtp", async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(ENDPOINT, { otp_code, otp_session_token });

    return {
      registration_token: response.data.registration_token,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "تأیید کد ناموفق بود.")
    );
  }
});
