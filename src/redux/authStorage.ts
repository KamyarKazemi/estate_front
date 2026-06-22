export interface UserProfile {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  role?: string;
}

export interface StoredAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
}

export const AUTH_STORAGE_KEYS = {
  session: "estate_auth_session",
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: "user",
} as const;

const normalizeToken = (value: string | null): string | null => {
  if (!value) return null;

  const token = value.trim();
  return token && token !== "undefined" && token !== "null" ? token : null;
};

const readUser = (): UserProfile | null => {
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
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEYS.session);

    if (rawSession) {
      const session = JSON.parse(rawSession) as Partial<StoredAuth>;
      return {
        accessToken: normalizeToken(session.accessToken ?? null),
        refreshToken: normalizeToken(session.refreshToken ?? null),
        user:
          session.user && typeof session.user === "object" ? session.user : null,
      };
    }

    return {
      accessToken: normalizeToken(
        localStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
      ),
      refreshToken: normalizeToken(
        localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
      ),
      user: readUser(),
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const persistStoredAuth = ({
  accessToken,
  refreshToken,
  user,
}: StoredAuth): void => {
  try {
    if (accessToken) {
      localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);

      if (refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
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
        JSON.stringify({ accessToken, refreshToken, user }),
      );
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
      localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
      localStorage.removeItem(AUTH_STORAGE_KEYS.user);
      localStorage.removeItem(AUTH_STORAGE_KEYS.session);
    }
  } catch {
    // Storage can be unavailable in locked-down browser contexts.
  }
};

export const extractToken = (
  payload: unknown,
  candidateKeys: string[],
): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;
  const containers = [source, source.tokens].filter(
    (value): value is Record<string, unknown> =>
      !!value && typeof value === "object",
  );

  for (const container of containers) {
    for (const key of candidateKeys) {
      const value = container[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  return null;
};
