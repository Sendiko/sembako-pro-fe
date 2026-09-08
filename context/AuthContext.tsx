"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Store } from "@/types/api";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  stores: Store[];
  activeStore: Store | null;
  activeStoreId: number | null;
  isLoading: boolean;
  error: string | null;
  setActiveStoreId: (storeId: number) => void;
  loginWithUserData: (user: User) => void;
  loginWithDemo: () => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  refreshStores: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreIdState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active store derived object
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || null;

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("sembako_user");
      const storedStoreId = localStorage.getItem("sembako_activeStoreId");

      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.Stores) {
          setStores(parsedUser.Stores);
        }
        if (storedStoreId) {
          setActiveStoreIdState(Number(storedStoreId));
        } else if (parsedUser.Stores && parsedUser.Stores.length > 0) {
          setActiveStoreIdState(parsedUser.Stores[0].id);
        }
        // Background sync to fetch fresh user & stores
        fetchUserStores(parsedUser.id);
      }
    } catch (e) {
      console.error("Error restoring auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserStores = async (userId: number) => {
    try {
      const res = await api.getStoresByUser(userId);
      if (res.store && Array.isArray(res.store)) {
        setStores(res.store);
        if (res.store.length > 0 && !activeStoreId) {
          setActiveStoreId(res.store[0].id);
        }
      }
    } catch (err) {
      console.warn("Could not fetch user stores:", err);
    }
  };

  const setActiveStoreId = (storeId: number) => {
    setActiveStoreIdState(storeId);
    localStorage.setItem("sembako_activeStoreId", String(storeId));
  };

  const loginWithUserData = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("sembako_user", JSON.stringify(loggedInUser));

    const userStores = loggedInUser.Stores || [];
    setStores(userStores);

    if (userStores.length > 0) {
      setActiveStoreId(userStores[0].id);
    }

    // Refresh from API
    fetchUserStores(loggedInUser.id);
  };

  const loginWithDemo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const demoPayload = {
        username: "Sendiko Demo",
        email: "demo.sendiko@example.com",
        profileUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sendiko",
      };
      const res = await api.syncUser(demoPayload);
      if (res.user) {
        let userStores = res.user.Stores || [];
        // If user has no store, create a default demo store
        if (userStores.length === 0) {
          try {
            const storeRes = await api.createStore({
              userId: res.user.id,
              name: "Toko Sembako Jaya",
              address: "Jl. Merdeka No. 123",
              phone: "081234567890",
              email: "tokojaya@example.com",
            });
            if (storeRes.store) {
              userStores = [
                Array.isArray(storeRes.store) ? storeRes.store[0] : storeRes.store,
              ];
            }
          } catch (e) {
            console.warn("Failed auto-creating demo store:", e);
          }
        }
        const fullUser = { ...res.user, Stores: userStores };
        loginWithUserData(fullUser);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Demo mode");
      console.error("Demo login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setStores([]);
    setActiveStoreIdState(null);
    localStorage.removeItem("sembako_user");
    localStorage.removeItem("sembako_activeStoreId");
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const res = await api.getUser(user.id);
      if (res.user) {
        setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
        localStorage.setItem("sembako_user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  const refreshStores = async () => {
    if (!user) return;
    await fetchUserStores(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stores,
        activeStore,
        activeStoreId,
        isLoading,
        error,
        setActiveStoreId,
        loginWithUserData,
        loginWithDemo,
        logout,
        refreshUserData,
        refreshStores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
