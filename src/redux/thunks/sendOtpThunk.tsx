import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_SECOND;

interface VerifyPayload {
  otp_code: number;
  otp_session_token: string;
}

export const sendOtpThunk = createAsyncThunk(
  "otp/send",
  async (
    { otp_code, otp_session_token }: VerifyPayload,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(URL, {
        otp_code,
        otp_session_token,
      });

      return {
        registration_token: response.data.registration_token,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  },
);
