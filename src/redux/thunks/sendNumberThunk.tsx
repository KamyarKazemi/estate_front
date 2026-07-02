import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_REGISTER_FIRST;

interface SendNumberResponse {
  phone_number: string;
  otp_session_token: string;
}

export const sendNumberThunk = createAsyncThunk<
  SendNumberResponse,
  string,
  { rejectValue: string }
>("register/sendNumber", async (phone_number, { rejectWithValue }) => {
  try {
    const response = await axios.post(ENDPOINT, { phone_number });

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
