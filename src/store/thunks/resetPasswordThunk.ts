import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_RESET_PASSWORD;

interface ResetPasswordPayload {
  reset_token: string;
  password: string;
  confirm_password: string;
}

export const resetPasswordThunk = createAsyncThunk<
  void,
  ResetPasswordPayload,
  { rejectValue: string }
>("resetPassword/setPassword", async (payload, { rejectWithValue }) => {
  try {
    await axios.post(ENDPOINT, payload);
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "تغییر رمز عبور ناموفق بود.")
    );
  }
});
