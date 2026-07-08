import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";
import type { UserProfile } from "../authStorage";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_AGENCIES_UPDATE;

export interface UpdateAgencyPayload {
  name: string;
  license_number: string;
  business_phone: string;
  description: string;
  province: string;
  city: string;
  exact_address: string;
}

export const updateAgencyThunk = createAsyncThunk<
  UserProfile,
  UpdateAgencyPayload,
  { state: RootState; rejectValue: string }
>("agency/update", async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.access_token;

  if (!token) {
    return rejectWithValue("توکن احراز هویت یافت نشد.");
  }

  try {
    const response = await axios.patch(ENDPOINT, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.user ?? response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "بروزرسانی اطلاعات آژانس ناموفق بود.")
    );
  }
});
