import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { persistStoredAuth } from "./authStorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

let previousAuth = store.getState().auth;

persistStoredAuth({
  accessToken: previousAuth.access_token,
  refreshToken: previousAuth.refresh_token,
  user: previousAuth.user,
});

store.subscribe(() => {
  const auth = store.getState().auth;

  if (
    auth.access_token === previousAuth.access_token &&
    auth.refresh_token === previousAuth.refresh_token &&
    auth.user === previousAuth.user
  ) {
    previousAuth = auth;
    return;
  }

  persistStoredAuth({
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    user: auth.user,
  });
  previousAuth = auth;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
