import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL_REGISTER_THIRD;
const ACCESS_URL = import.meta.env.VITE_BACKEND_URL_ACCESS;

export interface CompleteRegisterPayload {
  registration_token: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "CUSTOMER" | "AGENT";
  password: string;
  confirm_password: string;
}

interface UserProfile {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  role?: string;
}

interface CompleteRegisterResponse {
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile | null;
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

    const accessToken =
      response.data.access_token ||
      response.data.access ||
      response.data.tokens?.access;
    const refreshToken =
      response.data.refresh_token ||
      response.data.refresh ||
      response.data.tokens?.refresh;

    let user = response.data.user || response.data.profile || null;

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    if (accessToken && ACCESS_URL && !user) {
      const profileResponse = await axios.get(ACCESS_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      user = profileResponse.data;
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return {
      message: response.data.message,
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data ||
        "تکمیل ثبت‌نام ناموفق بود",
    );
  }
});
