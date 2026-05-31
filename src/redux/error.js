export function getErrorMessage(data, fallback = "Something went wrong") {
  if (!data || typeof data !== "object") return fallback;

  if (typeof data.message === "string") return data.message;
  if (typeof data.detail === "string") return data.detail;

  if (data.errors && typeof data.errors === "object") {
    const entries = Object.entries(data.errors);
    if (entries.length) {
      const [field, value] = entries[0];
      if (Array.isArray(value) && typeof value[0] === "string")
        return `${field}: ${value[0]}`;
      if (typeof value === "string") return `${field}: ${value}`;
    }
  }

  return fallback;
}

export function extractToken(data, candidateKeys) {
  const obj = data && typeof data === "object" ? data : {};
  for (const key of candidateKeys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}
