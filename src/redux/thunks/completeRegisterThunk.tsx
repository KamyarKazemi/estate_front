import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_THIRD;

export interface CompleteRegisterPayload {
  registration_token: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "CUSTOMER" | "AGENT";
  password: string;
  confirm_password: string;
}

interface CompleteRegisterResponse {
  message?: string;
}

console.log("ENV:", import.meta.env);
console.log("THIRD URL:", URL);

export const completeRegister = createAsyncThunk<
  CompleteRegisterResponse,
  CompleteRegisterPayload,
  { rejectValue: string }
>("register/complete", async (info, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, info);

    console.log("completeRegister thunk dispatched:", info);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data ||
        "تکمیل ثبت‌نام ناموفق بود",
    );
  }
});
