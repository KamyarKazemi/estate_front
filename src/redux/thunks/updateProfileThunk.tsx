import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "../store";
import type { UserProfile } from "../authStorage";
import { isJwtExpired, normalizeToken } from "../authStorage";
import { refreshAccessTokenThunk } from "../thunks/refreshAccessTokenThunk";

export interface UpdateProfilePayload {
  email?: string;
  first_name?: string;
  last_name?: string;
}

const UPDATE_PROFILE_URL = import.meta.env.VITE_BACKEND_URL_UPDATE_PROFILE;

const patchProfile = (token: string, body: Record<string, string>) => {
  return axios.patch(UPDATE_PROFILE_URL, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateProfileThunk = createAsyncThunk<
  { user: UserProfile },
  UpdateProfilePayload,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "profile/update",
  async (changedFields, { getState, dispatch, rejectWithValue }) => {
    let token = normalizeToken(getState().auth.access_token);

    if (!token) {
      return rejectWithValue("توکن احراز هویت یافت نشد.");
    }

    const body: Record<string, string> = {};

    if (changedFields.email !== undefined) {
      body.email = changedFields.email;
    }

    if (changedFields.first_name !== undefined) {
      body.first_name = changedFields.first_name;
    }

    if (changedFields.last_name !== undefined) {
      body.last_name = changedFields.last_name;
    }

    try {
      if (isJwtExpired(token)) {
        const refreshedToken = await dispatch(
          refreshAccessTokenThunk(),
        ).unwrap();
        token = normalizeToken(refreshedToken);
      }

      if (!token) {
        return rejectWithValue("توکن احراز هویت معتبر یافت نشد.");
      }

      const response = await patchProfile(token, body);

      const user: UserProfile = response.data?.user ?? response.data;

      return { user };
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        error.response?.data?.code === "token_not_valid"
      ) {
        try {
          const refreshedToken = await dispatch(
            refreshAccessTokenThunk(),
          ).unwrap();
          const newToken = normalizeToken(refreshedToken);

          if (!newToken) {
            return rejectWithValue(
              "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
            );
          }

          const retryResponse = await patchProfile(newToken, body);

          const user: UserProfile =
            retryResponse.data?.user ?? retryResponse.data;

          return { user };
        } catch {
          return rejectWithValue(
            "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
          );
        }
      }

      return rejectWithValue(
        getApiErrorMessage(error, "بروزرسانی اطلاعات ناموفق بود."),
      );
    }
  },
);
