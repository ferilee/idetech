# Local Setup

Dokumen ini menjelaskan cara menjalankan frontend `idetech` secara lokal.

## Prasyarat

- Node.js `22.x`
- npm `10.x`
- backend API sudah berjalan di `http://localhost:8080`

## Menjalankan Frontend

```bash
cd /home/pgun/dev/idetech/web-split
cp .env.example .env.local
```

Isi minimal:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_TENANT_SLUG=demo
```

Lalu:

```bash
npm install
npm run dev
```

## Flow Tenant-Aware Lokal

Blueprint mengharuskan tenant dibaca dari subdomain. Untuk development lokal:

- buka frontend lewat `http://demo.localhost:3000`
- backend tetap di `http://localhost:8080`
- frontend akan mendeteksi slug tenant dari host
- jika host tanpa subdomain, frontend fallback ke `NEXT_PUBLIC_DEFAULT_TENANT_SLUG`

URL penting:

- landing: `http://demo.localhost:3000`
- login: `http://demo.localhost:3000/login`
- dashboard: `http://demo.localhost:3000/dashboard`

## Kredensial Demo

- tenant: `demo`
- guru: `guru.demo` / `demo123`
- admin: `admin.demo` / `admin123`

## Build Check

```bash
cd /home/pgun/dev/idetech/web-split
npm run build
```
