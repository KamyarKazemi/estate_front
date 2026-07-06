import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_DELETE_CONFIRM;

interface Payload {
  otp_code: string;
}

export const confirmDeleteAccountThunk = createAsyncThunk<
  void,
  Payload,
  { state: RootState; rejectValue: string }
>(
  "account/deleteConfirm",

  async ({ otp_code }, { getState, rejectWithValue }) => {
    const token = getState().auth.access_token;

    if (!token) {
      return rejectWithValue("توکن احراز هویت یافت نشد.");
    }

    try {
      await axios.post(
        ENDPOINT,
        {
          otp_session_token: getState().auth.deleteAccountOtpSessionToken,

          otp_code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "حذف حساب ناموفق بود."));
    }
  },
);
