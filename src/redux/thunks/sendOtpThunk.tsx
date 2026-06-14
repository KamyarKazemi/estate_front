import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_SECOND;

interface VerifyPayload {
  otp_code: string;
  otp_session_token: string;
}

interface VerifyOtpResponse {
  registration_token: string;
}

console.log("ENV:", import.meta.env);
console.log("SECOND URL:", URL);

export const sendOtpThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyPayload,
  { rejectValue: string }
>("otp/send", async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, {
      otp_code,
      otp_session_token,
    });

    console.log("sendOtpThunk dispatched:", {
      otp_code,
    });

    return {
      registration_token: response.data.registration_token,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data ||
        "تأیید کد ناموفق بود",
    );
  }
});
