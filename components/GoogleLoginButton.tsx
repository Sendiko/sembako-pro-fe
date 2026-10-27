"use client";

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import type { GoogleJwtPayload } from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Loader2, ShieldCheck, AlertCircle, Key } from "lucide-react";

export function GoogleLoginButton() {
  const { loginWithUserData, loginWithDemo, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rawClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const isPlaceholderId =
    !rawClientId ||
    rawClientId.includes("your-google-client-id") ||
    rawClientId.includes("demo-client-id");

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setErrorMsg("Google Login tidak memberikan kredensial. Silakan coba lagi.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );

      const res = await api.syncUser({
        username: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        profileUrl: decoded.picture,
      });

      if (res.user) {
        let stores = res.user.Stores || [];
        if (stores.length === 0) {
          try {
            const storeRes = await api.createStore({
              userId: res.user.id,
              name: `Toko ${res.user.username}`,
              address: "Jl. Utama No. 1",
              phone: "081234567890",
            });
            if (storeRes.store) {
              stores = Array.isArray(storeRes.store)
                ? storeRes.store
                : [storeRes.store];
            }
          } catch (e) {
            console.warn("Gagal membuat toko awal secara otomatis:", e);
          }
        }
        loginWithUserData({ ...res.user, Stores: stores });
      } else {
        setErrorMsg("Server tidak mengembalikan profil pengguna.");
      }
    } catch (err: any) {
      console.error("Kesalahan autentikasi Google:", err);
      setErrorMsg(
        err.message || "Login Google gagal disinkronkan dengan server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithDemo();
    } catch (e: any) {
      setErrorMsg(e.message || "Login akun demo gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-button-wrap">
      {!isPlaceholderId ? (
        <div className="oauth-button-wrap">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() =>
              setErrorMsg(
                "Google Login gagal. Pastikan Client ID valid dan alamat aplikasi terdaftar sebagai origin di Google Cloud Console."
              )
            }
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="continue_with"
          />
        </div>
      ) : (
        <div className="oauth-placeholder">
          <Key size={16} />
          <div>
            <strong>Google Login belum disiapkan</strong>
            <p>
              Atur <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> di <code>.env.local</code> untuk mengaktifkan Google Login. Anda tetap bisa masuk menggunakan akun demo.
            </p>
          </div>
        </div>
      )}

      <div className="login-divider">
        {isPlaceholderId ? "Masuk dengan akun demo" : "atau coba akun demo"}
      </div>

      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="demo-login-button"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Masuk sebagai Pengguna Demo</span>
          </>
        )}
      </button>

      {(errorMsg || authError) && (
        <div className="login-error" role="alert">
          <AlertCircle size={16} />
          <span>{errorMsg || authError}</span>
        </div>
      )}

      <div className="login-trust">
        <ShieldCheck size={16} />
        <span>Masuk aman dan data toko terlindungi</span>
      </div>
    </div>
  );
}
