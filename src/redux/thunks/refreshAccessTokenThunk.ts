import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import { extractToken, normalizeToken } from "../authStorage";
import type { RootState } from "../store";

const REFRESH_URL = import.meta.env.VITE_BACKEND_URL_REFRESH;

export const refreshAccessTokenThunk = createAsyncThunk<
  string,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("auth/refreshAccessToken", async (_, { getState, rejectWithValue }) => {
  const state = getState();

  const refreshToken = normalizeToken(state.auth.refresh_token);

  if (!refreshToken) {
    return rejectWithValue("رفرش توکن یافت نشد. لطفاً دوباره وارد شوید.");
  }

  if (!REFRESH_URL) {
    return rejectWithValue("آدرس refresh token تنظیم نشده است.");
  }

  try {
    const response = await axios.post(REFRESH_URL, {
      refresh: refreshToken,
    });

    const newAccessToken = extractToken(response.data, [
      "access",
      "access_token",
    ]);

    if (!newAccessToken) {
      throw new Error("پاسخ refresh شامل access token معتبر نیست.");
    }

    return newAccessToken;
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
      ),
    );
  }
});
