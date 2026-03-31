"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  fetchCurrentUser,
  fetchUsers,
  type MeResponse,
  type UsersResponse,
} from "@/lib/api";
import {
  clearSession,
  readAccessToken,
  readSession,
  type StoredSession,
} from "@/lib/session";

const roleContent: Record<string, { title: string; body: string }> = {
  admin: {
    title: "Dashboard Admin Tenant",
    body: "Kelola tenant, pengguna, dan konfigurasi visual sekolah dari satu tempat.",
  },
  teacher: {
    title: "Dashboard Guru",
    body: "Lanjutkan ke IdeStudio, susun materi, dan siapkan kuis adaptif untuk kelas.",
  },
  student: {
    title: "Dashboard Siswa",
    body: "Lanjutkan quest, lihat progres belajar, dan buka jalur pengayaan atau remedial.",
  },
  parent: {
    title: "Dashboard Orang Tua",
    body: "Pantau progres belajar anak dan tindak lanjut yang direkomendasikan sistem.",
  },
};

export function DashboardShell() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [users, setUsers] = useState<UsersResponse["users"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = readSession();
    const token = readAccessToken();

    if (!storedSession || !token) {
      setError("Sesi belum tersedia. Silakan login kembali.");
      return;
    }

    setSession(storedSession);

    void Promise.all([fetchCurrentUser(token), fetchUsers(token)])
      .then(([profile, directory]) => {
        setMe(profile);
        setUsers(directory.users);
      })
      .catch(() => {
        clearSession();
        setError("Sesi tidak valid. Silakan login kembali.");
      });
  }, []);

  const role = me?.user.role ?? session?.role ?? "teacher";
  const content = roleContent[role] ?? roleContent.teacher;

  return (
    <div className="panel dashboard-card">
      <span className="eyebrow">Role Redirect</span>
      <h1>{content.title}</h1>
      <p>{content.body}</p>

      {session ? (
        <div className="tenant-result">
          <strong>Sesi aktif</strong>
          <div>Tenant: {session.tenantSlug}</div>
          <div>Username: {session.username}</div>
          <div>Role: {role}</div>
        </div>
      ) : null}

      {me ? (
        <div className="tenant-result">
          <strong>Profil aktif</strong>
          <div>Nama akun: {me.user.username}</div>
          <div>Email: {me.user.email}</div>
          <div>Role: {me.user.role}</div>
        </div>
      ) : null}

      {role === "teacher" ? (
        <div className="teacher-grid">
          <div className="tenant-result">
            <strong>IdeStudio</strong>
            <div>
              Mulai kelola materi, unggah file, dan siapkan konten pembelajaran.
            </div>
            <div>
              Modul ini menjadi pintu masuk guru sebelum masuk ke IdeGen dan
              quest.
            </div>
          </div>
          <div className="tenant-result">
            <strong>Quick Actions</strong>
            <div>1. Mulai workspace materi baru</div>
            <div>2. Susun bank materi kelas</div>
            <div>3. Siapkan draft kuis adaptif</div>
          </div>
          <div className="tenant-result">
            <strong>Kolaborator Tenant</strong>
            <div>{users.length} pengguna aktif tersedia di tenant ini.</div>
            {users.slice(0, 5).map((user) => (
              <div key={user.id}>
                {user.username} · {user.role}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <div className="tenant-result">Error: {error}</div> : null}

      <div className="dashboard-actions">
        <Link href="/login">Kembali ke login</Link>
        <button
          type="button"
          onClick={() => {
            clearSession();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
