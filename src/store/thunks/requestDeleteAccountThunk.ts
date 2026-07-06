import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_DELETE_REQUEST;

interface DeleteRequestResponse {
  otp_session_token: string;
}

export const requestDeleteAccountThunk = createAsyncThunk<
  DeleteRequestResponse,
  void,
  { state: RootState; rejectValue: string }
>("account/deleteRequest", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.access_token;

  if (!token) {
    return rejectWithValue("توکن احراز هویت یافت نشد.");
  }

  try {
    const response = await axios.post(
      ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      otp_session_token: response.data.otp_session_token,
    };
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "ارسال درخواست حذف ناموفق بود."),
    );
  }
});
