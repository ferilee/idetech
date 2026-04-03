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
import { detectTenantSlug } from "@/lib/tenant";

export function LoginForm() {
  const router = useRouter();
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [identity, setIdentity] = useState("guru.demo");
  const [password, setPassword] = useState("demo123");
  const [roleMode, setRoleMode] = useState("Guru");
  const [gradeLevel, setGradeLevel] = useState("SMA");
  const [identityTouched, setIdentityTouched] = useState(false);
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTenantSlug(detectTenantSlug());

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

  useEffect(() => {
    if (identityTouched) {
      return;
    }

    if (roleMode === "Guru") {
      setIdentity("guru.demo");
      setPassword("demo123");
      return;
    }

    if (roleMode === "Siswa") {
      setIdentity("siswa.demo");
      setPassword("demo123");
      return;
    }

    if (roleMode === "Orang Tua") {
      setIdentity("");
      setPassword("");
    }
  }, [identityTouched, roleMode]);

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
    <div className="panel auth-card login-card">
      <div className="auth-header">
        <span className="eyebrow">Sign In</span>
        <h1>Masuk ke IdeTech sesuai peranmu.</h1>
        <p>
          Login tetap menggunakan kredensial backend. Di bawah ini kamu bisa
          memilih mode tampilan untuk melihat perbedaan UI antarmuka peran dan
          jenjang.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="tenant-result">
          <strong>Tenant aktif</strong>
          <div>Slug: {tenantSlug}</div>
          <div>
            Kredensial demo: demo / guru.demo / demo123, siswa.demo / demo123
          </div>
        </div>

        <div className="role-picker">
          <label htmlFor="roleMode">
            Mode peran
            <select
              id="roleMode"
              value={roleMode}
              onChange={(event) => setRoleMode(event.target.value)}
            >
              <option>Guru</option>
              <option>Siswa</option>
              <option>Orang Tua</option>
            </select>
          </label>
          <label htmlFor="gradeLevel">
            Jenjang (untuk siswa)
            <select
              id="gradeLevel"
              value={gradeLevel}
              onChange={(event) => setGradeLevel(event.target.value)}
            >
              <option>SD</option>
              <option>SMP</option>
              <option>SMA</option>
              <option>Umum</option>
            </select>
          </label>
        </div>

        <label htmlFor="identity">
          Username atau email
          <input
            id="identity"
            value={identity}
            onChange={(event) => {
              setIdentity(event.target.value);
              setIdentityTouched(true);
            }}
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

        <div className="mode-preview">
          <strong>Preview mode</strong>
          <p>
            Tampilan akan menyesuaikan peran <span>{roleMode}</span>
            {roleMode === "Siswa" ? ` (${gradeLevel})` : ""}. Saat berhasil
            login, peran asli akun tetap diambil dari backend.
          </p>
        </div>
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
