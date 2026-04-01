import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IdeTech",
  description: "Tenant-aware learning platform scaffold",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
