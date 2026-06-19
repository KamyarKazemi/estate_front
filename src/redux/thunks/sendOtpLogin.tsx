import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const OTP_URL = import.meta.env.VITE_BACKEND_URL_LOGIN_SECOND;
const ACCESS_URL = import.meta.env.VITE_BACKEND_URL_ACCESS;

interface VerifyPayload {
  otp_code: string;
  otp_session_token: string;
}

interface UserProfile {
  id: number;
  username?: string;
  phone?: string;
  email?: string;
}

interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

export const sendOtpLoginThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyPayload,
  { rejectValue: string }
>("login/verifyOtp", async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(OTP_URL, {
      otp_code,
      otp_session_token,
    });

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    const profileResponse = await axios.get(ACCESS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("USER INFO FROM BACKEND:", profileResponse.data);
    localStorage.setItem("user", JSON.stringify(profileResponse.data));

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: profileResponse.data,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data ||
        "تأیید کد ناموفق بود",
    );
  }
});
