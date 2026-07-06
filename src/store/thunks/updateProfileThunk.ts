import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";
import type { UserProfile } from "../authStorage";

export interface UpdateProfilePayload {
  email?: string;
  first_name?: string;
  last_name?: string;
}

export const updateProfileThunk = createAsyncThunk(
  "profile/update",
  async (changedFields: UpdateProfilePayload, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.access_token;

    if (!token) {
      return rejectWithValue("توکن احراز هویت یافت نشد.");
    }

    const body: Record<string, string> = {};
    if (changedFields.email !== undefined) body.email = changedFields.email;
    if (changedFields.first_name !== undefined) body.first_name = changedFields.first_name;
    if (changedFields.last_name !== undefined) body.last_name = changedFields.last_name;

    try {
      const response = await axios.patch(
        import.meta.env.VITE_BACKEND_URL_UPDATE_PROFILE,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const user: UserProfile = response.data?.user ?? response.data;
      return { user };
    } catch (error: unknown) {
      return rejectWithValue(
        getApiErrorMessage(error, "بروزرسانی اطلاعات ناموفق بود.")
      );
    }
  },
);
