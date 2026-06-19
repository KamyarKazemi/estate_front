import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_FIRST;

interface SendNumberResponse {
  phone_number: string;
  otp_session_token: string;
}

console.log("ENV:", import.meta.env);
console.log("FIRST URL:", URL);

export const sendNumberThunk = createAsyncThunk<
  SendNumberResponse,
  string,
  { rejectValue: string }
>("register/sendNumber", async (phone_number, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, {
      phone_number,
    });

    console.log("sendNumberThunk got:", {
      phone_number,
      otp_session_token: response.data.otp_session_token,
    });

    return {
      phone_number,
      otp_session_token: response.data.otp_session_token,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data ||
        "ارسال کد تأیید ناموفق بود",
    );
  }
});
