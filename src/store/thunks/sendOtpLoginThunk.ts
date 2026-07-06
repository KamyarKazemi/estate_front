import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import { extractToken } from "../authStorage";
import type { UserProfile } from "../authStorage";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_LOGIN_SECOND;
const ACCESS_ENDPOINT = import.meta.env.VITE_BACKEND_URL_ACCESS;

interface VerifyPayload {
  otp_code: string;
  otp_session_token: string;
}

interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile | null;
}

export const sendOtpLoginThunk = createAsyncThunk<
  VerifyOtpResponse,
  VerifyPayload,
  { rejectValue: string }
>("login/verifyOtp", async ({ otp_code, otp_session_token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(ENDPOINT, { otp_code, otp_session_token });

    const accessToken = extractToken(response.data, ["access", "access_token"]);
    const refreshToken = extractToken(response.data, ["refresh", "refresh_token"]);

    if (!accessToken || !refreshToken) {
      throw new Error("پاسخ ورود شامل توکن معتبر نیست.");
    }

    const responseUser = response.data?.user;
    let user: UserProfile | null =
      responseUser && typeof responseUser === "object" ? responseUser : null;

    if (ACCESS_ENDPOINT && !user) {
      try {
        const profileResponse = await axios.get(ACCESS_ENDPOINT, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        user = profileResponse.data;
      } catch {
        // credentials remain valid if profile hydration is unavailable
      }
    }

    return { access_token: accessToken, refresh_token: refreshToken, user };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error, "تأیید کد ناموفق بود."));
  }
});
