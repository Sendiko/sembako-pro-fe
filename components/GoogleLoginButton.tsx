"use client";

import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GoogleJwtPayload } from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Loader2, ShieldCheck, AlertCircle, Info, Key } from "lucide-react";

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
      setErrorMsg("Google Sign-In returned empty credentials.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Decode Google ID Token
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );

      // 2. Post to backend /user endpoint (creates or logs in user)
      const res = await api.syncUser({
        username: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        profileUrl: decoded.picture,
      });

      if (res.user) {
        let stores = res.user.Stores || [];
        // If user has no store, create default store
        if (stores.length === 0) {
          try {
            const storeRes = await api.createStore({
              userId: res.user.id,
              name: `${res.user.username}'s Store`,
              address: "Jl. Utama No. 1",
              phone: "081234567890",
            });
            if (storeRes.store) {
              stores = Array.isArray(storeRes.store)
                ? storeRes.store
                : [storeRes.store];
            }
          } catch (e) {
            console.warn("Could not create initial store automatically:", e);
          }
        }
        loginWithUserData({ ...res.user, Stores: stores });
      } else {
        setErrorMsg("Backend did not return user profile.");
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setErrorMsg(
        err.message || "Failed to synchronize Google login with backend server."
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
      setErrorMsg(e.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Official Google OAuth Login Button or Placeholder Notice */}
      {!isPlaceholderId ? (
        <div className="w-full flex justify-center py-2 px-4 rounded-xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() =>
              setErrorMsg(
                "Google 401 Error: Ensure your Client ID is valid and 'http://localhost:3000' (or LAN IP) is listed under 'Authorized JavaScript origins' in Google Cloud Console."
              )
            }
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="continue_with"
          />
        </div>
      ) : (
        <div className="w-full p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2 text-left">
          <Key className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Google OAuth Keys Needed</p>
            <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
              Set <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">.env.local</code> to enable Google Login. Or use <strong>Sign in as Demo User</strong> below.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 w-full my-1">
        <div className="h-[1px] bg-slate-800 flex-1"></div>
        <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
          {isPlaceholderId ? "instant sign in" : "or quick test"}
        </span>
        <div className="h-[1px] bg-slate-800 flex-1"></div>
      </div>

      {/* Quick Demo Login Option */}
      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Sign in as Demo User</span>
          </>
        )}
      </button>

      {(errorMsg || authError) && (
        <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span className="leading-relaxed">{errorMsg || authError}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Idempotent Google OAuth & Demo Flow</span>
      </div>
    </div>
  );
}
