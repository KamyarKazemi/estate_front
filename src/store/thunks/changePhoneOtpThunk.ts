import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_CHANGE_NUMBER_SECOND;

interface ChangePhoneOtpPayload {
  otp_session_token: string;
  otp_code: string;
  phone_number: string;
}

interface ChangePhoneOtpResponse {
  phone_number: string;
}

export const changePhoneOtpThunk = createAsyncThunk<
  ChangePhoneOtpResponse,
  ChangePhoneOtpPayload,
  { state: RootState; rejectValue: string }
>(
  "changePhone/verifyOtp",
  async (
    { otp_session_token, otp_code, phone_number },
    { getState, rejectWithValue },
  ) => {
    const token = getState().auth.access_token;

    if (!token) {
      return rejectWithValue("توکن احراز هویت یافت نشد.");
    }

    try {
      await axios.post(
        ENDPOINT,
        { otp_session_token, otp_code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // return the new phone number so the slice can update user state
      return { phone_number };
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error, "تأیید کد ناموفق بود."));
    }
  },
);
