"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { X, Plus, Building2, Loader2 } from "lucide-react";

export function CreateStoreModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, refreshStores, setActiveStoreId } = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Sesi pengguna tidak ditemukan. Silakan masuk kembali.");
      return;
    }
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError("Lengkapi nama toko, alamat, dan nomor telepon.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createStore({
        userId: user.id,
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      });

      if (!res.store) {
        throw new Error("Server tidak mengembalikan data toko.");
      }

      await refreshStores();
      const createdStore = Array.isArray(res.store) ? res.store[0] : res.store;
      if (createdStore?.id) {
        setActiveStoreId(createdStore.id);
      }
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Toko gagal dibuat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-store-title">
        <button
          onClick={onClose}
          className="icon-button modal-close"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="modal-header">
          <div>
            <p className="eyebrow">LOKASI USAHA</p>
            <h2 id="create-store-title">Tambah Toko</h2>
            <p className="modal-subtitle">Daftarkan lokasi toko yang ingin Anda kelola.</p>
          </div>
        </div>

        {error && (
          <div className="notice notice-error">
            <Building2 size={17} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Nama Toko
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Toko Sembako Jaya"
                required
              />
          </label>

          <label>
            Alamat Toko
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 123"
                required
              />
          </label>

          <label>
            Nomor Telepon
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                required
              />
          </label>

          <label>
            Email <span className="optional">(opsional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@contoh.com"
              />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="button button-primary"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Simpan Toko</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
