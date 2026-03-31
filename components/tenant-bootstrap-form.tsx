"use client";

import { useEffect, useState, useTransition } from "react";

import { fetchTenantBootstrap, type TenantBootstrap } from "@/lib/api";
import { detectTenantSlug } from "@/lib/tenant";

export function TenantBootstrapForm() {
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<TenantBootstrap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const nextSlug = detectTenantSlug();
    setSlug(nextSlug);
    void handleRefresh(nextSlug);
  }, []);

  function handleRefresh(nextSlug = slug) {
    setError(null);

    startTransition(async () => {
      try {
        const payload = await fetchTenantBootstrap(nextSlug);
        setResult(payload);
      } catch (submitError) {
        setResult(null);
        setError(
          submitError instanceof Error ? submitError.message : "request failed",
        );
      }
    });
  }

  return (
    <div className="panel hero-side bootstrap-card">
      <h2>Tenant Bootstrap</h2>
      <p>
        Tenant dibaca otomatis dari host aplikasi. Untuk development tanpa
        subdomain, fallback lokal tetap memakai tenant <strong>demo</strong>.
      </p>

      <div className="tenant-result">
        <strong>Tenant terdeteksi</strong>
        <div>Slug: {slug || "-"}</div>
      </div>

      <button
        type="button"
        onClick={() => handleRefresh()}
        disabled={isPending}
      >
        {isPending ? "Memuat..." : "Refresh bootstrap tenant"}
      </button>

      {error ? <div className="tenant-result">Error: {error}</div> : null}

      {result ? (
        <div className="tenant-result">
          <strong>{result.tenant.name}</strong>
          <div>Slug: {result.tenant.slug}</div>
          <div>Domain: {result.tenant.domain}</div>
          <div>Status: {result.tenant.status}</div>
        </div>
      ) : null}
    </div>
  );
}
