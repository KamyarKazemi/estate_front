import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_CHANGE_PHONE;

interface ChangePhoneResponse {
  otp_session_token: string;
}

export const changePhoneThunk = createAsyncThunk<
  ChangePhoneResponse,
  string,
  { state: RootState; rejectValue: string }
>("changePhone/sendPhone", async (phone_number, { getState, rejectWithValue }) => {
  const token = getState().auth.access_token;

  if (!token) {
    return rejectWithValue("توکن احراز هویت یافت نشد.");
  }

  try {
    const response = await axios.post(
      ENDPOINT,
      { phone_number },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return { otp_session_token: response.data.otp_session_token };
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "ارسال کد تأیید ناموفق بود.")
    );
  }
});
