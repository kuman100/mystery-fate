import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  weight: ['400', '600', '800'], 
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Mystery Fate 2026 - Cek Hoki Kamu!",
  description: "Apakah kamu Sultan atau Apes di tahun 2026? Cek takdirmu sekarang dengan AI Super Canggih! 🔮",
  openGraph: {
    title: "Mystery Fate 2026 🔮",
    description: "Cek Khodam & Hoki 2026 kamu disini. Gratis!",
    url: "https://mystery-fate.vercel.app",
    siteName: "Mystery Fate 2026",
    images: [
      {
        url: "https://mystery-fate.vercel.app/og-image.jpg", // Pastikan ada file gambar di folder public
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans bg-[#020617] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}