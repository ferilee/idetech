"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { fetchUsers, type UsersResponse } from "@/lib/api";

export function DashboardShell() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UsersResponse["users"]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      fetchUsers(session.accessToken)
        .then((directory) => setUsers(directory.users))
        .catch(console.error);
    }
  }, [session?.accessToken]);

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Menyiapkan dashboard Anda...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="error-card">
        <h2>Akses Ditolak</h2>
        <p>Anda harus login untuk mengakses halaman ini.</p>
        <Link href="/login" className="btn-primary">Kembali ke Login</Link>
      </div>
    );
  }

  const role = session?.user?.role || "student";
  const user = session?.user;

  // Theme based on role
  const themeClass = `theme-${role}`;

  return (
    <div className={`dashboard-layout ${themeClass}`}>
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-brand">
          <Image src="/logo.png" alt="IdeTech" width={40} height={40} />
          {isSidebarOpen && <span>IdeTech</span>}
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="icon">🏠</span>
            {isSidebarOpen && "Beranda"}
          </Link>
          {role === "admin" && (
            <>
              <Link href="/dashboard/tenants" className="nav-item">
                <span className="icon">🏢</span>
                {isSidebarOpen && "Kelola Tenant"}
              </Link>
              <Link href="/dashboard/users" className="nav-item">
                <span className="icon">👥</span>
                {isSidebarOpen && "Pengguna"}
              </Link>
              <Link href="/dashboard/analytics" className="nav-item">
                <span className="icon">📊</span>
                {isSidebarOpen && "Statistik Global"}
              </Link>
            </>
          )}
          {role === "teacher" && (
            <>
              <Link href="/dashboard/studio" className="nav-item">
                <span className="icon">🎨</span>
                {isSidebarOpen && "IdeStudio"}
              </Link>
              <Link href="/dashboard/classes" className="nav-item">
                <span className="icon">🏫</span>
                {isSidebarOpen && "Kelas Saya"}
              </Link>
              <Link href="/dashboard/bank" className="nav-item">
                <span className="icon">📚</span>
                {isSidebarOpen && "Bank Ide"}
              </Link>
            </>
          )}
          {role === "student" && (
            <>
              <Link href="/dashboard/quests" className="nav-item">
                <span className="icon">🗺️</span>
                {isSidebarOpen && "Quest Map"}
              </Link>
              <Link href="/dashboard/achievements" className="nav-item">
                <span className="icon">🏆</span>
                {isSidebarOpen && "Pencapaian"}
              </Link>
              <Link href="/dashboard/colab" className="nav-item">
                <span className="icon">🤝</span>
                {isSidebarOpen && "Co-Lab"}
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => signOut()} className="logout-btn">
            <span className="icon">🚪</span>
            {isSidebarOpen && "Keluar"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <div className="header-title">
              <h1>Halo, {user?.name || user?.username || "Pengguna"}!</h1>
              <p className="subtitle">
                {role === "admin" && "Panel Kendali Pusat IdeTech"}
                {role === "teacher" && "Siap menginspirasi siswa hari ini?"}
                {role === "student" && "Lanjutkan petualangan belajarmu!"}
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-badge">
              <span className={`role-tag ${role}`}>{role}</span>
              <div className="avatar-wrapper">
                <img 
                  src={user?.image || "/logo.png"} 
                  alt="Profile" 
                  className="avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {role === "admin" && <AdminOverview users={users} />}
          {role === "teacher" && <TeacherOverview />}
          {role === "student" && <StudentOverview />}
        </div>
      </main>
    </div>
  );
}

function AdminOverview({ users }: { users: any[] }) {
  return (
    <div className="overview-container">
      <div className="section-header">
        <h2>Ringkasan Tenant</h2>
        <button className="btn-small">Unduh Laporan</button>
      </div>
      <div className="overview-grid">
        <div className="stat-card admin">
          <div className="card-icon">👥</div>
          <div className="card-data">
            <h3>Total Pengguna</h3>
            <p className="stat-value">{users.length || 124}</p>
            <p className="stat-delta positive">↑ 12% dari bulan lalu</p>
          </div>
        </div>
        <div className="stat-card admin">
          <div className="card-icon">⚡</div>
          <div className="card-data">
            <h3>Kesehatan Sistem</h3>
            <p className="stat-value">99.9%</p>
            <p className="stat-label">Uptime Operasional</p>
          </div>
        </div>
        <div className="stat-card admin">
          <div className="card-icon">💳</div>
          <div className="card-data">
            <h3>Lisensi Tenant</h3>
            <p className="stat-value">Premium</p>
            <p className="stat-label">Aktif hingga Des 2026</p>
          </div>
        </div>
        
        <div className="wide-card admin">
          <h3>Aksi Cepat Admin</h3>
          <div className="action-grid">
            <div className="action-card">
              <h4>Manajemen Guru</h4>
              <p>Undang dan atur hak akses pengajar.</p>
              <button className="btn-text">Buka ➔</button>
            </div>
            <div className="action-card">
              <h4>Visual Branding</h4>
              <p>Ubah logo dan skema warna platform.</p>
              <button className="btn-text">Buka ➔</button>
            </div>
            <div className="action-card">
              <h4>Audit Log</h4>
              <p>Pantau aktivitas keamanan sistem.</p>
              <button className="btn-text">Buka ➔</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherOverview() {
  return (
    <div className="overview-container">
      <div className="section-header">
        <h2>Aktivitas Mengajar</h2>
        <div className="header-actions">
          <button className="btn-primary">+ Materi Baru</button>
        </div>
      </div>
      <div className="overview-grid">
        <div className="stat-card teacher highlight">
          <div className="card-content">
            <h3>IdeStudio</h3>
            <p>Terakhir diedit: "Ekosistem Laut" (2 jam lalu)</p>
            <button className="btn-white">Lanjutkan Mengedit</button>
          </div>
        </div>
        <div className="stat-card teacher">
          <h3>Radar Pintar</h3>
          <div className="radar-viz">
            <div className="viz-bar" style={{height: '70%'}}></div>
            <div className="viz-bar" style={{height: '85%'}}></div>
            <div className="viz-bar" style={{height: '60%'}}></div>
            <div className="viz-bar" style={{height: '90%'}}></div>
          </div>
          <p className="stat-label">Pemahaman konsep: 78%</p>
        </div>
        
        <div className="wide-card teacher">
          <h3>Jadwal Kelas & Quest Map</h3>
          <div className="class-table">
            <div className="table-row header">
              <span>Nama Kelas</span>
              <span>Quest Aktif</span>
              <span>Progres</span>
              <span>Aksi</span>
            </div>
            <div className="table-row">
              <span>Matematika 8B</span>
              <span>Aljabar Dasar</span>
              <span className="badge teal">82%</span>
              <button className="btn-icon">👁️</button>
            </div>
            <div className="table-row">
              <span>Sains 7A</span>
              <span>Siklus Air</span>
              <span className="badge amber">45%</span>
              <button className="btn-icon">👁️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentOverview() {
  return (
    <div className="overview-container">
      <div className="section-header">
        <h2>Petualangan Belajarmu</h2>
      </div>
      <div className="overview-grid">
        <div className="stat-card student quest">
          <div className="quest-header">
            <h3>Quest Map Aktif</h3>
            <span className="quest-tag">Chapter 4</span>
          </div>
          <p className="quest-title">Pecahan dan Desimal</p>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: '65%'}}></div>
            </div>
            <span>65%</span>
          </div>
        </div>
        
        <div className="stat-card student xp">
          <div className="card-top">
            <h3>IdePoin</h3>
            <span className="level-badge">LVL 5</span>
          </div>
          <p className="stat-value">1,250</p>
          <p className="stat-label">Rank: Silver Voyager</p>
        </div>
        
        <div className="wide-card student">
          <h3>Tantangan Baru & Reward</h3>
          <div className="challenge-grid">
            <div className="challenge-card active">
              <div className="challenge-icon">🔥</div>
              <div className="challenge-info">
                <h4>Streak 5 Hari</h4>
                <p>Kerjakan 1 kuis setiap hari.</p>
              </div>
              <span className="reward-tag">+50 XP</span>
            </div>
            <div className="challenge-card">
              <div className="challenge-icon">💎</div>
              <div className="challenge-info">
                <h4>Kolektor Badge</h4>
                <p>Dapatkan 3 badge minggu ini.</p>
              </div>
              <span className="reward-tag">+200 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
