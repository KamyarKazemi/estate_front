import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_LOGIN_SECOND;

interface VerifyPayload {
  otp_code: string;
  otp_session_token: string;
}

interface VerifyOtpResponse {
  access: string;
  refresh: string;
}

console.log("ENV:", import.meta.env);
console.log("SECOND URL:", URL);

export const sendOtpLoginThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyPayload,
  { rejectValue: string }
>("otp/send", async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, {
      otp_code,
      otp_session_token,
    });

    console.log("sendOtpLoginThunk dispatched:", {
      otp_code,
    });

    console.log("ACCESS TOKEN:", response.data.access);
    console.log("REFRESH TOKEN:", response.data.refresh);

    return {
      access: response.data.access,
      refresh: response.data.refresh,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data ||
        "تأیید کد ناموفق بود",
    );
  }
});
