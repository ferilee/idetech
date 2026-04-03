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

const roleContent: Record<
  string,
  { title: string; body: string; highlights: string[] }
> = {
  admin: {
    title: "Dashboard Admin Tenant",
    body: "Kelola tenant, pengguna, dan konfigurasi visual sekolah dari satu tempat.",
    highlights: [
      "Atur struktur kelas dan role pengguna.",
      "Pantau kesehatan tenant dan lisensi.",
      "Aktifkan template IdeStudio untuk guru.",
    ],
  },
  teacher: {
    title: "Dashboard Guru",
    body: "Lanjutkan ke IdeStudio, susun materi, dan siapkan kuis adaptif untuk kelas.",
    highlights: [
      "Buat konten interaktif dengan drag-and-drop.",
      "Luncurkan IdeQuest untuk tiap kelas.",
      "Pantau progres lewat Radar Pintar.",
    ],
  },
  student: {
    title: "Dashboard Siswa",
    body: "Lanjutkan quest, lihat progres belajar, dan buka jalur pengayaan atau remedial.",
    highlights: [
      "Quest map bertahap dengan IdePoin.",
      "Badge mingguan dan tantangan rahasia.",
      "Hint otomatis untuk materi remedial.",
    ],
  },
  parent: {
    title: "Dashboard Orang Tua",
    body: "Pantau progres belajar anak dan tindak lanjut yang direkomendasikan sistem.",
    highlights: [
      "Lihat radar kesulitan konsep utama.",
      "Dapatkan rekomendasi pendampingan.",
      "Notifikasi target belajar mingguan.",
    ],
  },
};

const featureCards = [
  {
    title: "IdeStudio",
    body: "Upload materi, pilih template, dan ubah menjadi kuis, flashcard, atau mini-game.",
  },
  {
    title: "IdeQuest",
    body: "Quest map dengan level, IdePoin, dan reward progres untuk siswa.",
  },
  {
    title: "Co-Lab",
    body: "Ruang proyek kolaboratif dengan forum dan kanvas digital real-time.",
  },
  {
    title: "Bank Ide",
    body: "Katalog RPP interaktif dengan rating, review, dan opsi duplikasi.",
  },
  {
    title: "Radar Pintar",
    body: "Insight akurasi, waktu belajar, dan pola kesalahan kelas.",
  },
];

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
      <span className="eyebrow">Role Workspace</span>
      <h1>{content.title}</h1>
      <p>{content.body}</p>

      <div className="dashboard-highlights">
        {content.highlights.map((item) => (
          <div className="highlight-card" key={item}>
            {item}
          </div>
        ))}
      </div>

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

      <div className="teacher-grid feature-shelf">
        {featureCards.map((card) => (
          <div className="tenant-result feature-card" key={card.title}>
            <strong>{card.title}</strong>
            <div>{card.body}</div>
          </div>
        ))}
      </div>

      <div className="tenant-result role-actions">
        <strong>Rekomendasi Aksi Cepat</strong>
        {role === "teacher" ? (
          <>
            <div>
              1. Mulai workspace IdeStudio baru untuk materi minggu ini.
            </div>
            <div>2. Tambahkan quest map untuk kelas 8B.</div>
            <div>3. Bagikan template Bank Ide ke guru lain.</div>
          </>
        ) : null}
        {role === "student" ? (
          <>
            <div>1. Lanjutkan quest “Pecahan dan Desimal”.</div>
            <div>2. Klaim badge “Streak 5 Hari”.</div>
            <div>3. Buka hint remedial untuk soal nomor 4.</div>
          </>
        ) : null}
        {role === "parent" ? (
          <>
            <div>1. Lihat radar kesulitan konsep Matematika.</div>
            <div>2. Set target belajar 3 sesi minggu ini.</div>
            <div>3. Kirim pesan dukungan ke guru kelas.</div>
          </>
        ) : null}
        {role === "admin" ? (
          <>
            <div>1. Tambah pengguna guru baru.</div>
            <div>2. Aktifkan template IdeQuest semester ini.</div>
            <div>3. Audit akses Co-Lab untuk kelas proyek.</div>
          </>
        ) : null}
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
