import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AUTH_STORAGE_KEYS, readStoredAuth } from "./authStorage";
import { hydrateAuth } from "./authSlice";
import type { AppDispatch } from ".";

export function AuthStorageSync() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const hydrateFromStorage = (allowClear: boolean) => {
      const storedAuth = readStoredAuth();
      if (storedAuth.accessToken || allowClear) {
        dispatch(hydrateAuth(storedAuth));
      }
    };

    const syncAuth = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key !== null && event.key !== AUTH_STORAGE_KEYS.session) return;
      hydrateFromStorage(true);
    };

    const syncVisiblePage = () => {
      if (document.visibilityState === "visible") hydrateFromStorage(false);
    };

    const syncRestoredPage = () => hydrateFromStorage(false);

    window.addEventListener("storage", syncAuth);
    window.addEventListener("pageshow", syncRestoredPage);
    document.addEventListener("visibilitychange", syncVisiblePage);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("pageshow", syncRestoredPage);
      document.removeEventListener("visibilitychange", syncVisiblePage);
    };
  }, [dispatch]);

  return null;
}
