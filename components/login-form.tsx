"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setError(null);
    startTransition(async () => {
      await signIn("google", { callbackUrl: "/dashboard" });
    });
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Kredensial tidak valid. Silakan coba lagi.");
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="login-splash-content">
      <div className="login-brand">
        <Image src="/logo.png" alt="IdeTech logo" width={80} height={80} />
      </div>
      
      <div className="login-splash-header">
        <h2>Selamat Datang Kembali</h2>
        <p>Masuk ke akun IdeTech Anda untuk melanjutkan petualangan belajar.</p>
      </div>

      <div className="login-actions">
        {/* Form Login Kredensial */}
        <form onSubmit={handleCredentialsLogin} className="credentials-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          
          {error && <p className="login-error-msg">{error}</p>}
          
          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={isPending}
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="login-divider">
          <span>atau</span>
        </div>

        <button 
          className="google-login-btn" 
          onClick={handleGoogleLogin}
          disabled={isPending}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isPending ? "Menghubungkan..." : "Masuk dengan Google"}
        </button>

        <p className="login-footer-text">
          Belum punya akun? <a href="#">Daftar sekarang</a>
        </p>
      </div>
    </div>
  );
}
