import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiErrorMessage } from "../apiError";
import type { RootState } from "..";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL_AGENCIES_DELETE;

export const deleteAgencyThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>("agency/delete", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.access_token;

  if (!token) {
    return rejectWithValue("توکن احراز هویت یافت نشد.");
  }

  try {
    await axios.delete(ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    return rejectWithValue(
      getApiErrorMessage(error, "حذف آژانس ناموفق بود.")
    );
  }
});
