export interface UserProfile {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  role?: string;

  // agent-only fields
  name?: string;
  license_number?: string;
  business_phone?: string;
  description?: string;
  province?: string;
  city?: string;
  exact_address?: string;
}

export interface StoredAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
}

type StoredAuthLike = Partial<StoredAuth> & {
  access_token?: string | null;
  refresh_token?: string | null;
};

export const AUTH_STORAGE_KEYS = {
  session: "estate_auth_session",
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: "user",
} as const;

const isBrowser = (): boolean => typeof window !== "undefined";

export const normalizeToken = (value?: string | null): string | null => {
  if (!value) return null;
  const token = value.replace(/^Bearer\s+/i, "").trim();
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const decodeJwtPayload = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  token: string,
): T | null => {
  try {
    const normalizedToken = normalizeToken(token);
    if (!normalizedToken) return null;
    const payloadPart = normalizedToken.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
};

export const isJwtExpired = (
  token: string | null | undefined,
  bufferSeconds = 30,
): boolean => {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) return true;
  const payload = decodeJwtPayload<{ exp?: number }>(normalizedToken);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() >= (payload.exp - bufferSeconds) * 1000;
};

const readUser = (): UserProfile | null => {
  if (!isBrowser()) return null;
  const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  if (!rawUser) return null;
  try {
    const user = JSON.parse(rawUser) as unknown;
    return user && typeof user === "object" ? (user as UserProfile) : null;
  } catch {
    return null;
  }
};

export const readStoredAuth = (): StoredAuth => {
  if (!isBrowser()) return { accessToken: null, refreshToken: null, user: null };
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEYS.session);
    if (rawSession) {
      const session = JSON.parse(rawSession) as StoredAuthLike;
      return {
        accessToken: normalizeToken(session.accessToken ?? session.access_token ?? null),
        refreshToken: normalizeToken(session.refreshToken ?? session.refresh_token ?? null),
        user: session.user && typeof session.user === "object" ? session.user : null,
      };
    }
    return {
      accessToken: normalizeToken(localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)),
      refreshToken: normalizeToken(localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)),
      user: readUser(),
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const persistStoredAuth = ({ accessToken, refreshToken, user }: StoredAuth): void => {
  if (!isBrowser()) return;
  try {
    const normalizedAccessToken = normalizeToken(accessToken);
    const normalizedRefreshToken = normalizeToken(refreshToken);
    if (normalizedAccessToken) {
      localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, normalizedAccessToken);
      if (normalizedRefreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, normalizedRefreshToken);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
      }
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEYS.user);
      }
      localStorage.setItem(
        AUTH_STORAGE_KEYS.session,
        JSON.stringify({ accessToken: normalizedAccessToken, refreshToken: normalizedRefreshToken, user }),
      );
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    localStorage.removeItem(AUTH_STORAGE_KEYS.session);
  } catch {
    // Storage can be unavailable in locked-down browser contexts.
  }
};

export const updateStoredAccessToken = (accessToken: string): void => {
  if (!isBrowser()) return;
  try {
    const currentAuth = readStoredAuth();
    const normalizedAccessToken = normalizeToken(accessToken);
    if (!normalizedAccessToken) return;
    persistStoredAuth({
      accessToken: normalizedAccessToken,
      refreshToken: currentAuth.refreshToken,
      user: currentAuth.user,
    });
  } catch {
    // Storage can be unavailable in locked-down browser contexts.
  }
};

export const clearStoredAuth = (): void => {
  persistStoredAuth({ accessToken: null, refreshToken: null, user: null });
};

export const extractToken = (payload: unknown, candidateKeys: string[]): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const source = payload as Record<string, unknown>;
  const containers: Record<string, unknown>[] = [source];
  if (source.tokens && typeof source.tokens === "object") {
    containers.push(source.tokens as Record<string, unknown>);
  }
  for (const container of containers) {
    for (const key of candidateKeys) {
      const value = container[key];
      if (typeof value === "string") {
        const token = normalizeToken(value);
        if (token) return token;
      }
    }
  }
  return null;
};
