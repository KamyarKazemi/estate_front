import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_THIRD;

interface VerifyInfo {
  registration_token: string | null;
  first_name: "string" | null;
  last_name: "string" | null;
  email: "string" | null;
  role: "Customer" | "Agent" | null;
  password: "string" | null;
  confirm_password: string | null;
}

const info: VerifyInfo = {
  registration_token: null,
  first_name: null,
  last_name: null,
  email: null,
  role: null,
  password: null,
  confirm_password: null,
};

console.log("ENV:", import.meta.env);
console.log("THIRD URL:", import.meta.env);

export const completeRegister = createAsyncThunk<void, VerifyInfo>(
  "register/complete",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(URL, info);

      console.log("complete register thunk dispatched!", info);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  },
);
