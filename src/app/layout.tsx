import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mystery Fate 2026 🔮", // Judul di Tab Browser
  description: "Cek Ramalan, Hoki, dan Khodam Kamu di Tahun Baru 2026! Apakah kamu Sultan atau Sadboy?", // Deskripsi saat link dishare
  icons: {
    icon: '/icon', // Mengarah ke file icon otomatis (Langkah 2)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}