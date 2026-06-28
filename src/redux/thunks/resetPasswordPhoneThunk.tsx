import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_RESET_PHONE;

interface ResetPhoneResponse {
  phone_number: string;
  otp_session_token: string;
}

export const resetPasswordPhoneThunk = createAsyncThunk<
  ResetPhoneResponse,
  string,
  { rejectValue: string }
>("resetPassword/sendPhone", async (phone_number, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, { phone_number });

    return {
      phone_number,
      otp_session_token: response.data.otp_session_token,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "ارسال کد تأیید ناموفق بود.",
      );
    }
    return rejectWithValue("ارسال کد تأیید ناموفق بود.");
  }
});
