import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAuthProviderWrapper } from "@/components/GoogleAuthProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";


const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sembako Pro — Kasir & Stok Barang",
  description: "Kelola kasir, stok barang, dan penjualan toko sembako dalam satu aplikasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GoogleAuthProviderWrapper>
          <AuthProvider>{children}</AuthProvider>
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}
