"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  fetchCurrentUser,
  login,
  type LoginResponse,
  type MeResponse,
} from "@/lib/api";
import { clearSession, readAccessToken, saveSession } from "@/lib/session";

export function LoginForm() {
  const router = useRouter();
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [identity, setIdentity] = useState("guru.demo");
  const [password, setPassword] = useState("demo123");
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      return;
    }

    void fetchCurrentUser(token)
      .then((payload) => {
        setMe(payload);
      })
      .catch(() => {
        clearSession();
      });
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const nextSession = await login({
          tenant_slug: tenantSlug,
          identity,
          password,
        });
        saveSession({
          accessToken: nextSession.access_token,
          role: nextSession.user.role,
          username: nextSession.user.username,
          tenantSlug: nextSession.user.tenant_slug,
        });
        setSession(nextSession);
        const nextMe = await fetchCurrentUser(nextSession.access_token);
        setMe(nextMe);
        router.push("/dashboard");
      } catch (submitError) {
        setSession(null);
        setMe(null);
        setError(
          submitError instanceof Error ? submitError.message : "login failed",
        );
      }
    });
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setMe(null);
  }

  return (
    <div className="panel auth-card">
      <div className="auth-header">
        <span className="eyebrow">Sign In</span>
        <h1>Masuk ke workspace IdeTech</h1>
        <p>
          Auth awal menggunakan seed user demo dari backend. Kredensial default:
          <strong> demo / guru.demo / demo123</strong>.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="tenant-slug">
          Tenant
          <input
            id="tenant-slug"
            value={tenantSlug}
            onChange={(event) => setTenantSlug(event.target.value)}
          />
        </label>

        <label htmlFor="identity">
          Username atau email
          <input
            id="identity"
            value={identity}
            onChange={(event) => setIdentity(event.target.value)}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" disabled={isPending}>
          {isPending ? "Memproses..." : "Login"}
        </button>
      </form>

      {error ? <div className="tenant-result">Error: {error}</div> : null}

      {session ? (
        <div className="tenant-result">
          <strong>Login berhasil</strong>
          <div>Tenant: {session.tenant.name}</div>
          <div>Role: {session.user.role}</div>
          <div>Token type: {session.token_type}</div>
          <div>Expires in: {session.expires_in}s</div>
        </div>
      ) : null}

      {me ? (
        <div className="tenant-result">
          <strong>Current user</strong>
          <div>Username: {me.user.username}</div>
          <div>Email: {me.user.email}</div>
          <div>Role: {me.user.role}</div>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
