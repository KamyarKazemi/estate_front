import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AUTH_STORAGE_KEYS, readStoredAuth } from "./authStorage";
import { hydrateAuth } from "./slices/authSlice";
import type { AppDispatch } from "./store";

export function AuthStorageSync() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const syncAuth = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key !== null && event.key !== AUTH_STORAGE_KEYS.session) return;

      dispatch(hydrateAuth(readStoredAuth()));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [dispatch]);

  return null;
}
