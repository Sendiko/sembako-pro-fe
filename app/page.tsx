"use client";

import { useAuth } from "@/context/AuthContext";
import { StoreDashboard } from "@/components/StoreDashboard";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { CheckCircle2, ShoppingBag, Sparkles } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="page-loading" aria-live="polite">
        <span className="loading-mark"><ShoppingBag size={24} /></span>
        <p>Menyiapkan Sembako Pro...</p>
      </main>
    );
  }

  if (user) return <StoreDashboard />;

  return (
    <main className="login-page">
      <header className="login-header">
        <a className="brand-lockup" href="/" aria-label="Sembako Pro beranda">
            <span className="brand-mark"><ShoppingBag size={23} /></span>
            <span><strong>Sembako Pro</strong><small>Operasional toko lebih mudah</small></span>
        </a>
        <span className="login-status"><span /> Siap membantu toko Anda</span>
      </header>
      <section className="login-content">
        <div className="login-copy">
            <div className="eyebrow"><Sparkles size={15} /> APLIKASI TOKO SEMBAKO</div>
            <h1>Semua urusan toko,<br /><span>dalam satu genggaman.</span></h1>
            <p>Catat penjualan, pantau stok barang, dan kelola toko dengan lebih tenang setiap hari.</p>
            <div className="login-benefits">
              <div><CheckCircle2 size={18} /><span>Kasir cepat dan pencatatan otomatis</span></div>
              <div><CheckCircle2 size={18} /><span>Stok barang selalu terpantau</span></div>
              <div><CheckCircle2 size={18} /><span>Ringkasan penjualan yang jelas</span></div>
            </div>
        </div>
        <div className="login-card">
            <span className="login-card-icon"><ShoppingBag size={26} /></span>
            <h2>Selamat datang</h2>
            <p>Masuk untuk mulai mengelola toko Anda.</p>
            <GoogleLoginButton />
            <small className="login-note">Data toko Anda tersimpan dengan aman.</small>
        </div>
      </section>
      <footer className="login-footer">Sembako Pro <span>•</span> Pendamping usaha toko Indonesia</footer>
    </main>
  );
}
