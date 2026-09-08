"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { CreateStoreModal } from "@/components/CreateStoreModal";
import { api } from "@/lib/api";
import { Grocery, Transaction, Statistics, HealthCheckResponse } from "@/types/api";
import {
  ShoppingBag,
  Store as StoreIcon,
  Package,
  History,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Boxes,
  Receipt,
  ShoppingCart,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const {
    user,
    stores,
    activeStore,
    activeStoreId,
    setActiveStoreId,
    logout,
    isLoading: authLoading,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"pos" | "inventory" | "stores" | "history">("pos");
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // Grocery Catalog & Stock state
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [groceriesLoading, setGroceriesLoading] = useState(false);
  
  // New/Edit Grocery Modal Form
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null);
  const [gName, setGName] = useState("");
  const [gUnit, setGUnit] = useState("Kg");
  const [gPrice, setGPrice] = useState<number | "">("");
  const [gQuantity, setGQuantity] = useState<number | "">("");
  const [gImageUrl, setGImageUrl] = useState("");

  // Stock Edit Modal
  const [stockEditGrocery, setStockEditGrocery] = useState<Grocery | null>(null);
  const [newStockQty, setNewStockQty] = useState<number>(0);

  // POS State
  const [selectedGroceryId, setSelectedGroceryId] = useState<number | null>(null);
  const [posAmount, setPosAmount] = useState<number>(1);
  const [posSubmitting, setPosSubmitting] = useState(false);
  const [posSuccessMsg, setPosSuccessMsg] = useState<string | null>(null);

  // Transactions history state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transLoading, setTransLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState<Statistics | null>(null);

  // Health status state
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // General Notification Alert
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch Groceries & Transactions whenever Active Store changes
  useEffect(() => {
    if (activeStoreId) {
      loadGroceries(activeStoreId);
      loadTransactions(activeStoreId);
    }
  }, [activeStoreId]);

  // Fetch stats & health whenever User changes
  useEffect(() => {
    if (user?.id) {
      loadStats(user.id);
    }
    checkServerHealth();
  }, [user?.id]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadGroceries = async (storeId: number) => {
    setGroceriesLoading(true);
    try {
      const res = await api.getGroceries(storeId);
      if (res.groceries) {
        setGroceries(res.groceries);
      }
    } catch (err: any) {
      console.error("Failed loading groceries:", err);
    } finally {
      setGroceriesLoading(false);
    }
  };

  const loadTransactions = async (storeId: number) => {
    setTransLoading(true);
    try {
      const res = await api.getTransactions(storeId);
      if (res.transactions) {
        setTransactions(res.transactions);
      }
    } catch (err: any) {
      console.error("Failed loading transactions:", err);
    } finally {
      setTransLoading(false);
    }
  };

  const loadStats = async (userId: number) => {
    try {
      const res = await api.getStats(userId);
      if (res.statistics) {
        setStats(res.statistics);
      }
    } catch (err) {
      console.error("Failed loading stats:", err);
    }
  };

  const checkServerHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await api.checkHealth();
      setHealth(res);
    } catch (err) {
      console.warn("Health check error:", err);
    } finally {
      setHealthLoading(false);
    }
  };

  // --- GROCERY ACTIONS ---
  const handleSaveGrocery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoreId) {
      showNotification("error", "No active store selected.");
      return;
    }
    if (!gName || !gUnit || gPrice === "") {
      showNotification("error", "Name, Unit, and Price are required.");
      return;
    }

    try {
      if (editingGrocery) {
        // Update Grocery PUT /grocery/:id
        await api.updateGrocery(editingGrocery.id, {
          storeId: activeStoreId,
          name: gName,
          unit: gUnit,
          price: Number(gPrice),
          imageUrl: gImageUrl || undefined,
        });
        showNotification("success", "Grocery item updated successfully!");
      } else {
        // Create Grocery POST /grocery
        await api.createGrocery({
          storeId: activeStoreId,
          name: gName,
          unit: gUnit,
          price: Number(gPrice),
          imageUrl: gImageUrl || undefined,
          quantity: gQuantity !== "" ? Number(gQuantity) : 0,
        });
        showNotification("success", "New grocery item added!");
      }

      setIsGroceryModalOpen(false);
      resetGroceryForm();
      loadGroceries(activeStoreId);
      if (user?.id) loadStats(user.id);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save grocery item.");
    }
  };

  const handleDeleteGrocery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this grocery item?")) return;
    try {
      await api.deleteGrocery(id);
      showNotification("success", "Grocery item deleted.");
      if (activeStoreId) loadGroceries(activeStoreId);
      if (user?.id) loadStats(user.id);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete item.");
    }
  };

  const openEditGroceryModal = (item: Grocery) => {
    setEditingGrocery(item);
    setGName(item.name);
    setGUnit(item.unit);
    setGPrice(item.price);
    setGImageUrl(item.imageUrl || "");
    setIsGroceryModalOpen(true);
  };

  const resetGroceryForm = () => {
    setEditingGrocery(null);
    setGName("");
    setGUnit("Kg");
    setGPrice("");
    setGQuantity("");
    setGImageUrl("");
  };

  // --- STOCK ACTIONS ---
  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockEditGrocery) return;
    try {
      await api.updateStock(stockEditGrocery.id, newStockQty);
      showNotification("success", `Stock updated to ${newStockQty} ${stockEditGrocery.unit}`);
      setStockEditGrocery(null);
      if (activeStoreId) loadGroceries(activeStoreId);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update stock.");
    }
  };

  // --- POS / TRANSACTION ACTIONS ---
  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoreId || !selectedGroceryId) {
      showNotification("error", "Please select a grocery item for sale.");
      return;
    }

    const selectedItem = groceries.find((g) => g.id === selectedGroceryId);
    if (!selectedItem) return;

    if (posAmount <= 0) {
      showNotification("error", "Amount must be at least 1.");
      return;
    }

    const currentStock = selectedItem.stock?.quantity ?? 0;
    if (currentStock < posAmount) {
      showNotification("error", `Insufficient stock (${currentStock} left).`);
      return;
    }

    const totalPrice = selectedItem.price * posAmount;

    setPosSubmitting(true);
    try {
      await api.createTransaction({
        storeId: activeStoreId,
        groceryId: selectedGroceryId,
        amount: posAmount,
        totalPrice,
      });

      setPosSuccessMsg(
        `Sold ${posAmount} ${selectedItem.unit} of ${selectedItem.name} for Rp ${totalPrice.toLocaleString()}`
      );
      setSelectedGroceryId(null);
      setPosAmount(1);
      
      // Refresh inventory & history
      loadGroceries(activeStoreId);
      loadTransactions(activeStoreId);
      if (user?.id) loadStats(user.id);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to complete transaction.");
    } finally {
      setPosSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Sembako Pro...</p>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE FOR UNAUTHENTICATED USERS ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top bar */}
        <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800/60 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                Sembako Pro
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  POS & Inventory
                </span>
              </h1>
              <p className="text-xs text-slate-400">Powered by REST API Documentation</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>API Status: Online</span>
          </div>
        </header>

        {/* Hero Banner */}
        <main className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 py-12 z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Grocery Store Management System</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Manage your Grocery Store & Sales with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Google OAuth</span>
            </h2>

            <p className="text-slate-400 text-base max-w-xl leading-relaxed">
              Track stock levels, execute point-of-sale transactions with automatic inventory deduction, manage multi-store locations, and view real-time sales statistics.
            </p>

            {/* Feature List */}
            <div className="grid grid-[#1] sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Idempotent User Onboarding</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Automatic POS Stock Adjustment</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Multi-Store Context Switcher</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Real-time Revenue Analytics</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full lg:w-auto flex flex-col items-center">
            <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <Building2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Welcome Back</h3>
                <p className="text-xs text-slate-400 mt-1">Sign in with Google OAuth or Demo Account</p>
              </div>

              {/* Login Button Component */}
              <GoogleLoginButton />
            </div>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 border-t border-slate-800/60 z-10">
          Penghitung Sembako REST API &copy; 2026. Built with Next.js & Tailwind CSS.
        </footer>
      </div>
    );
  }

  // --- MAIN DASHBOARD FOR AUTHENTICATED USERS ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl text-white shadow-md shadow-emerald-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:inline-block">Sembako Pro</span>
          </div>

          {/* Active Store Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline">Store:</span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <StoreIcon className="w-4 h-4 text-emerald-400 mr-2" />
              <select
                value={activeStoreId || ""}
                onChange={(e) => setActiveStoreId(Number(e.target.value))}
                className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer pr-2"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Add Store"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile & Health & Logout */}
          <div className="flex items-center gap-3">
            {/* Health status badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  health?.status === "healthy" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              ></div>
              <span>API: {health?.status || "Connecting..."}</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user.profileUrl ? (
                <img
                  src={user.profileUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {user.username}
              </span>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between animate-fade-in ${
              notification.type === "success"
                ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-200"
                : "bg-red-950/40 border-red-800/50 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Items in Store</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {groceries.length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Boxes className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Store Revenue</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                Rp {(stats?.totalSales || 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Completed Transactions</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {transactions.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "pos"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>POS / Quick Sale</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "inventory"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Groceries Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sales History</span>
          </button>

          <button
            onClick={() => setActiveTab("stores")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "stores"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Stores ({stores.length})</span>
          </button>
        </div>

        {/* TAB 1: POS / QUICK SALE */}
        {activeTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items Grid Selector */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center justify-between">
                <span>Select Grocery Item for Checkout</span>
                <span className="text-xs text-slate-400 font-normal">
                  {groceries.length} items available
                </span>
              </h3>

              {groceriesLoading ? (
                <div className="p-12 text-center text-slate-500 flex justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                </div>
              ) : groceries.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center space-y-3">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">No groceries in this store yet.</p>
                  <button
                    onClick={() => {
                      resetGroceryForm();
                      setIsGroceryModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-500"
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groceries.map((item) => {
                    const isSelected = selectedGroceryId === item.id;
                    const stockQty = item.stock?.quantity ?? 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGroceryId(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                          isSelected
                            ? "bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-emerald-400 font-bold mt-0.5">
                              Rp {item.price.toLocaleString()} / {item.unit}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs mt-2">
                            <span
                              className={`px-2 py-0.5 rounded-md font-medium ${
                                stockQty > 10
                                  ? "bg-slate-950 text-slate-400"
                                  : stockQty > 0
                                  ? "bg-amber-950/50 text-amber-400 border border-amber-800/40"
                                  : "bg-red-950/50 text-red-400 border border-red-800/40"
                              }`}
                            >
                              Stock: {stockQty} {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* POS Checkout Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
              <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
                Transaction Checkout
              </h3>

              {selectedGroceryId ? (
                (() => {
                  const item = groceries.find((g) => g.id === selectedGroceryId);
                  if (!item) return null;
                  const total = item.price * posAmount;
                  const stockQty = item.stock?.quantity ?? 0;

                  return (
                    <form onSubmit={handleProcessTransaction} className="space-y-4">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <p className="text-xs text-slate-400">Selected Item</p>
                        <p className="font-bold text-white text-base mt-0.5">{item.name}</p>
                        <p className="text-xs text-emerald-400 mt-1">
                          Rp {item.price.toLocaleString()} per {item.unit}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Quantity ({item.unit})
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPosAmount((prev) => Math.max(1, prev - 1))}
                            className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={stockQty}
                            value={posAmount}
                            onChange={(e) => setPosAmount(Math.max(1, Number(e.target.value)))}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center font-bold text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPosAmount((prev) => Math.min(stockQty, prev + 1))
                            }
                            className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Subtotal ({posAmount} {item.unit})</span>
                          <span>Rp {total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-emerald-500/20">
                          <span>Total Price</span>
                          <span className="text-emerald-400">Rp {total.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={posSubmitting || stockQty < posAmount}
                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {posSubmitting ? "Processing..." : "Complete Sale (POST /transaction)"}
                      </button>
                    </form>
                  );
                })()
              ) : (
                <div className="py-10 text-center text-slate-500 text-xs">
                  Click on any grocery item on the left to start checkout.
                </div>
              )}

              {posSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{posSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GROCERIES INVENTORY */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Groceries Catalog & Inventory</h3>
              <button
                onClick={() => {
                  resetGroceryForm();
                  setIsGroceryModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Grocery Item</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock Qty</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {groceries.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <span>{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{item.unit}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">
                          Rp {item.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white mr-2">
                            {item.stock?.quantity ?? 0}
                          </span>
                          <button
                            onClick={() => {
                              setStockEditGrocery(item);
                              setNewStockQty(item.stock?.quantity ?? 0);
                            }}
                            className="text-xs text-emerald-400 hover:underline cursor-pointer"
                          >
                            (Adjust)
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => openEditGroceryModal(item)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGrocery(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALES HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Store Sales History</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="px-4 py-3">Grocery Name</th>
                      <th className="px-4 py-3">Amount Sold</th>
                      <th className="px-4 py-3">Total Price</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-400">#{tx.id}</td>
                        <td className="px-4 py-3 font-semibold text-white">
                          {tx.Grocery?.name || `Grocery ID: ${tx.groceryId}`}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{tx.amount}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">
                          Rp {tx.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORES MANAGEMENT */}
        {activeTab === "stores" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Your Managed Stores</h3>
              <button
                onClick={() => setIsStoreModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Store</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((s) => {
                const isActive = s.id === activeStoreId;
                return (
                  <div
                    key={s.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? "bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                        {isActive && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active Store
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-base">{s.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{s.address}</p>
                        <p className="text-xs text-slate-400">Phone: {s.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveStoreId(s.id)}
                      disabled={isActive}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-emerald-950/50 text-emerald-300 border border-emerald-800/40"
                          : "bg-slate-800 text-white hover:bg-slate-700"
                      }`}
                    >
                      {isActive ? "Currently Active" : "Set as Active Store"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* CREATE / EDIT GROCERY MODAL */}
      {isGroceryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {editingGrocery ? "Edit Grocery Item" : "Add New Grocery Item"}
            </h3>

            <form onSubmit={handleSaveGrocery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  placeholder="e.g. Beras Raja Platinum"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Unit *</label>
                  <input
                    type="text"
                    value={gUnit}
                    onChange={(e) => setGUnit(e.target.value)}
                    placeholder="e.g. Kg, Lt, Pcs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Price (Rp) *</label>
                  <input
                    type="number"
                    value={gPrice}
                    onChange={(e) =>
                      setGPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 19000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {!editingGrocery && (
                <div>
                  <label className="block text-slate-300 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={gQuantity}
                    onChange={(e) =>
                      setGQuantity(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 50"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={gImageUrl}
                  onChange={(e) => setGImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroceryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOCK MODAL */}
      {stockEditGrocery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-white">
              Adjust Stock for {stockEditGrocery.name}
            </h3>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">
                  New Quantity ({stockEditGrocery.unit})
                </label>
                <input
                  type="number"
                  value={newStockQty}
                  onChange={(e) => setNewStockQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockEditGrocery(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Update Stock (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE STORE MODAL */}
      <CreateStoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </div>
  );
}
