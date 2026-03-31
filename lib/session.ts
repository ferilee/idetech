export const ACCESS_TOKEN_KEY = "idetech_access_token";
export const LOGIN_SESSION_KEY = "idetech_login_session";

export type StoredSession = {
  accessToken: string;
  role: string;
  username: string;
  tenantSlug: string;
};

export function saveSession(session: StoredSession) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(LOGIN_SESSION_KEY, JSON.stringify(session));
}

export function readSession(): StoredSession | null {
  const raw = window.localStorage.getItem(LOGIN_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(LOGIN_SESSION_KEY);
}

export function readAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}
