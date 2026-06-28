import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_RESET_PASSWORD;

interface ResetPasswordPayload {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export const resetPasswordThunk = createAsyncThunk<
  void,
  ResetPasswordPayload,
  { rejectValue: string }
>("resetPassword/setPassword", async (payload, { rejectWithValue }) => {
  try {
    await axios.post(URL, payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "تغییر رمز عبور ناموفق بود",
      );
    }
  }
});
