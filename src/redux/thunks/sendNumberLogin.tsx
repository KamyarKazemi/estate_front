import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_LOGIN_FIRST;

interface SendNumberLoginPayload {
  phone_number: string;
  password: string;
}

interface SendNumberResponse {
  phone_number: string;
  otp_session_token: string;
}

export const sendNumberLoginThunk = createAsyncThunk<
  SendNumberResponse,
  SendNumberLoginPayload,
  { rejectValue: string }
>("login/sendNumber", async ({ phone_number, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(ENDPOINT, { phone_number, password });

    return {
      phone_number,
      otp_session_token: response.data.otp_session_token,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "ارسال کد تأیید ناموفق بود.")
    );
  }
});
