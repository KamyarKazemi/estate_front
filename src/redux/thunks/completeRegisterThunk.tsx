import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import { extractToken } from "../authStorage";
import type { UserProfile } from "../authStorage";

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

interface CompleteRegisterResponse {
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile | null;
}

export const completeRegister = createAsyncThunk<
  CompleteRegisterResponse,
  CompleteRegisterPayload,
  { rejectValue: string }
>("register/complete", async (info, { rejectWithValue }) => {
  try {
    const response = await axios.post(URL, info);
    const accessToken = extractToken(response.data, ["access", "access_token"]);
    const refreshToken = extractToken(response.data, [
      "refresh",
      "refresh_token",
    ]);
    const responseUser = response.data?.user ?? response.data?.profile;
    let user: UserProfile | null =
      responseUser && typeof responseUser === "object" ? responseUser : null;

    if (accessToken && ACCESS_URL && !user) {
      try {
        const profileResponse = await axios.get(ACCESS_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        user = profileResponse.data;
      } catch {
        // Registration remains successful if profile hydration needs a retry.
      }
    }

    return {
      message: response.data.message,
      access_token: accessToken ?? undefined,
      refresh_token: refreshToken ?? undefined,
      user,
    };
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "تکمیل ثبت‌نام ناموفق بود."),
    );
  }
});
