import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "../store";
import type { UserProfile } from "../authStorage";
import { isJwtExpired, normalizeToken } from "../authStorage";
import { refreshAccessTokenThunk } from "../thunks/refreshAccessTokenThunk";

export interface UpdatePhonePayload {
  phone_number?: string;
  otp_session_token: string;
}

const F_ENDPOINT = import.meta.env.VITE_BACKEND_URL_CHANGE_NUMBER_FIRST;

const patchPhone = (token: string, body: Record<string, string>) => {
  return axios.post(F_ENDPOINT, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const ChangeNumberFirstThunk = createAsyncThunk<
  { phone_number?: string; otp_session_token: string },
  UpdatePhonePayload,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "number/change",
  async (changedFields, { getState, dispatch, rejectWithValue }) => {
    let token = normalizeToken(getState().auth.access_token);

    if (!token) {
      return rejectWithValue("توکن احراز هویت یافت نشد.");
    }

    const body: { phone_number?: string; otp_session_token: string } = {
      otp_session_token: changedFields.otp_session_token,
    };

    if (changedFields.phone_number !== undefined) {
      body.phone_number = changedFields.phone_number;
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

      const response = await patchPhone(token, body);

      const user: UserProfile = response.data?.user ?? response.data;

      return {
        phone_number: user.phone_number,
        otp_session_token: changedFields.otp_session_token,
      };
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

          const retryResponse = await patchPhone(newToken, body);

          const user: UserProfile =
            retryResponse.data?.user ?? retryResponse.data;

          return {
            phone_number: user.phone_number,
            otp_session_token: changedFields.otp_session_token,
          };
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
