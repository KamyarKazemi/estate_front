import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";
import type { UserProfile } from "../authStorage";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_AGENCIES_CREATE;

export interface CreateAgencyPayload {
  name: string;
  license_number: string;
  business_phone: string;
  description: string;
  province: string;
  city: string;
  exact_address: string;
}

export const createAgencyThunk = createAsyncThunk<
  UserProfile,
  CreateAgencyPayload,
  { state: RootState; rejectValue: string }
>("agency/create", async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.access_token;

  if (!token) {
    return rejectWithValue("توکن احراز هویت یافت نشد.");
  }

  try {
    const response = await axios.post(ENDPOINT, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // backend may return the updated user/agency object directly or nested
    return response.data?.user ?? response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "ثبت اطلاعات آژانس ناموفق بود.")
    );
  }
});
