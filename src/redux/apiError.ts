import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data;

    if (data && typeof data === "object") {
      const response = data as Record<string, unknown>;

      for (const key of ["message", "detail", "error"]) {
        const value = response[key];
        if (typeof value === "string" && value.trim()) return value;
      }
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
