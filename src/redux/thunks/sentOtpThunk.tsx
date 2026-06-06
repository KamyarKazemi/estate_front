import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_FIRST;

export const sendOtpThunk = createAsyncThunk(
  "auth/aendOtp",
  async (phone_number: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(URL, {
        phone_number,
      });

      return {
        phone_number,
        otp_session_token: response.data.otp_session_token,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "OTP request failed");
    }
  },
);
