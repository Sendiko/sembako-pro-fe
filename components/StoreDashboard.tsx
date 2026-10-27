"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit2,
  History,
  LogOut,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { CreateStoreModal } from "@/components/CreateStoreModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Grocery, Statistics, Transaction } from "@/types/api";

type DashboardTab = "pos" | "inventory" | "history" | "stores";
type Notice = { type: "success" | "error"; message: string };

const money = (amount: number) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function StockBadge({ quantity }: { quantity: number }) {
  if (quantity <= 0) {
    return <span className="stock-badge stock-empty"><X size={14} /> Habis</span>;
  }
  if (quantity < 5) {
    return <span className="stock-badge stock-low"><AlertTriangle size={14} /> Menipis</span>;
  }
  return <span className="stock-badge stock-safe"><CheckCircle2 size={14} /> Stok Aman</span>;
}

export function StoreDashboard() {
  const {
    user,
    stores,
    activeStore,
    activeStoreId,
    setActiveStoreId,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("pos");
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [healthStatus, setHealthStatus] = useState<"healthy" | "offline" | "checking">("checking");
  const [groceriesLoading, setGroceriesLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [groceryFormError, setGroceryFormError] = useState<string | null>(null);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [groceryModalOpen, setGroceryModalOpen] = useState(false);
  const [stockEditGrocery, setStockEditGrocery] = useState<Grocery | null>(null);
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null);
  const [search, setSearch] = useState("");
  const [selectedGroceryId, setSelectedGroceryId] = useState<number | null>(null);
  const [posAmount, setPosAmount] = useState(1);
  const [posSubmitting, setPosSubmitting] = useState(false);
  const [posSuccess, setPosSuccess] = useState<string | null>(null);
  const [grocerySaving, setGrocerySaving] = useState(false);
  const [stockSaving, setStockSaving] = useState(false);
  const [gName, setGName] = useState("");
  const [gUnit, setGUnit] = useState("Pcs");
  const [gPrice, setGPrice] = useState<number | "">("");
  const [gQuantity, setGQuantity] = useState<number | "">("");
  const [gImageUrl, setGImageUrl] = useState("");
  const [gImageFile, setGImageFile] = useState<File | null>(null);
  const [newStockQty, setNewStockQty] = useState(0);

  const selectedGrocery = groceries.find((item) => item.id === selectedGroceryId) ?? null;
  const lowStockCount = groceries.filter((item) => {
    const quantity = item.stock?.quantity ?? 0;
    return quantity > 0 && quantity < 5;
  }).length;
  const filteredGroceries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    return groceries.filter((item) => item.name.toLocaleLowerCase("id-ID").includes(query));
  }, [groceries, search]);

  useEffect(() => {
    if (!activeStoreId) {
      setGroceries([]);
      setTransactions([]);
      return;
    }

    let active = true;
    setGroceriesLoading(true);
    setTransactionsLoading(true);
    Promise.all([
      api.getGroceries(activeStoreId),
      api.getTransactions(activeStoreId),
    ])
      .then(([groceryResponse, transactionResponse]) => {
        if (!active) return;
        setGroceries(groceryResponse.groceries ?? []);
        setTransactions(transactionResponse.transactions ?? []);
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Gagal memuat data toko:", error);
          setNotice({ type: "error", message: getErrorMessage(error, "Data toko gagal dimuat.") });
        }
      })
      .finally(() => {
        if (active) {
          setGroceriesLoading(false);
          setTransactionsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activeStoreId]);

  useEffect(() => {
    if (!user?.id) return;
    api.getStats(user.id)
      .then((response) => setStats(response.statistics ?? null))
      .catch((error: unknown) => console.error("Gagal memuat statistik:", error));
  }, [user?.id, transactions.length]);

  useEffect(() => {
    let active = true;
    api.checkHealth()
      .then((response) => {
        if (active) setHealthStatus(response.status === "healthy" ? "healthy" : "offline");
      })
      .catch(() => {
        if (active) setHealthStatus("offline");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const refreshStoreData = async () => {
    if (!activeStoreId) return;
    setGroceriesLoading(true);
    setTransactionsLoading(true);
    try {
      const [groceryResponse, transactionResponse] = await Promise.all([
        api.getGroceries(activeStoreId),
        api.getTransactions(activeStoreId),
      ]);
      setGroceries(groceryResponse.groceries ?? []);
      setTransactions(transactionResponse.transactions ?? []);
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error, "Gagal memperbarui data.") });
    } finally {
      setGroceriesLoading(false);
      setTransactionsLoading(false);
    }
  };

  const resetGroceryForm = () => {
    setEditingGrocery(null);
    setGName("");
    setGUnit("Pcs");
    setGPrice("");
    setGQuantity("");
    setGImageUrl("");
    setGImageFile(null);
    setGroceryFormError(null);
  };

  const openNewGrocery = () => {
    resetGroceryForm();
    setGroceryModalOpen(true);
  };

  const openEditGrocery = (item: Grocery) => {
    setEditingGrocery(item);
    setGName(item.name);
    setGUnit(item.unit);
    setGPrice(item.price);
    setGQuantity("");
    setGImageUrl(item.imageUrl ?? "");
    setGImageFile(null);
    setGroceryFormError(null);
    setGroceryModalOpen(true);
  };

  const handleSaveGrocery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGroceryFormError(null);
    if (!activeStoreId || gPrice === "") {
      setGroceryFormError("Lengkapi nama, satuan, dan harga barang.");
      return;
    }
    if (!gImageFile && !gImageUrl.trim()) {
      setGroceryFormError("Pilih foto atau masukkan URL gambar untuk barang ini.");
      return;
    }
    setGrocerySaving(true);
    try {
      const imageUrl = gImageFile
        ? await api.uploadImage(gImageFile)
        : gImageUrl.trim() || undefined;
      if (editingGrocery) {
        await api.updateGrocery(editingGrocery.id, {
          storeId: activeStoreId,
          name: gName.trim(),
          unit: gUnit.trim(),
          price: Number(gPrice),
          imageUrl,
        });
        setNotice({ type: "success", message: "Perubahan barang berhasil disimpan." });
      } else {
        await api.createGrocery({
          storeId: activeStoreId,
          name: gName.trim(),
          unit: gUnit.trim(),
          price: Number(gPrice),
          quantity: gQuantity === "" ? 0 : Number(gQuantity),
          imageUrl,
        });
        setNotice({ type: "success", message: "Barang baru berhasil ditambahkan." });
      }
      setGroceryModalOpen(false);
      resetGroceryForm();
      await refreshStoreData();
    } catch (error) {
      setGroceryFormError(getErrorMessage(error, "Barang gagal disimpan."));
    } finally {
      setGrocerySaving(false);
    }
  };

  const handleDeleteGrocery = async (item: Grocery) => {
    if (!window.confirm(`Hapus ${item.name} dari katalog barang?`)) return;
    try {
      await api.deleteGrocery(item.id);
      if (selectedGroceryId === item.id) setSelectedGroceryId(null);
      setNotice({ type: "success", message: `${item.name} berhasil dihapus.` });
      await refreshStoreData();
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error, "Barang gagal dihapus.") });
    }
  };

  const handleUpdateStock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stockEditGrocery) return;
    setStockSaving(true);
    try {
      await api.updateStock(stockEditGrocery.id, newStockQty);
      setNotice({ type: "success", message: `Stok ${stockEditGrocery.name} berhasil diperbarui.` });
      setStockEditGrocery(null);
      await refreshStoreData();
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error, "Stok gagal diperbarui.") });
    } finally {
      setStockSaving(false);
    }
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeStoreId || !selectedGrocery) {
      setNotice({ type: "error", message: "Pilih barang yang akan dijual terlebih dahulu." });
      return;
    }
    const stock = selectedGrocery.stock?.quantity ?? 0;
    if (posAmount < 1 || posAmount > stock) {
      setNotice({ type: "error", message: `Stok tersedia hanya ${stock} ${selectedGrocery.unit}.` });
      return;
    }
    setPosSubmitting(true);
    setPosSuccess(null);
    try {
      await api.createTransaction({
        storeId: activeStoreId,
        groceryId: selectedGrocery.id,
        amount: posAmount,
        totalPrice: selectedGrocery.price * posAmount,
      });
      setPosSuccess(`${posAmount} ${selectedGrocery.unit} ${selectedGrocery.name} berhasil dicatat.`);
      setSelectedGroceryId(null);
      setPosAmount(1);
      await refreshStoreData();
    } catch (error) {
      setNotice({ type: "error", message: getErrorMessage(error, "Transaksi gagal diproses.") });
    } finally {
      setPosSubmitting(false);
    }
  };

  const tabs: { id: DashboardTab; label: string; icon: typeof ShoppingCart }[] = [
    { id: "pos", label: "Kasir", icon: ShoppingCart },
    { id: "inventory", label: "Stok Barang", icon: Package },
    { id: "history", label: "Riwayat Transaksi", icon: History },
    { id: "stores", label: "Toko Saya", icon: Building2 },
  ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <a className="brand-lockup" href="/" aria-label="Sembako Pro beranda">
            <span className="brand-mark"><ShoppingBag size={21} /></span>
            <span className="brand-title">Sembako<span>Pro</span></span>
          </a>
          <div className="header-profile">
            <span className={`connection-indicator ${healthStatus}`} title={`Status server: ${healthStatus}`}>
              <Activity size={15} />
              <span>{healthStatus === "healthy" ? "Terhubung" : healthStatus === "offline" ? "Tidak terhubung" : "Memeriksa"}</span>
            </span>
            <span className="profile-avatar">
              {user?.profileUrl ? <img src={user.profileUrl} alt="" /> : user?.username.slice(0, 1).toUpperCase()}
            </span>
            <span className="profile-name">{user?.username}</span>
            <button className="icon-button logout-button" onClick={logout} aria-label="Keluar">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">{new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</p>
            <h1>Selamat datang, {user?.username.split(" ")[0]} <span>👋</span></h1>
            <p className="welcome-subtitle">Berikut ringkasan usaha Anda hari ini.</p>
          </div>
          <button className="button button-secondary refresh-button" onClick={refreshStoreData} disabled={groceriesLoading || transactionsLoading}>
            <RefreshCw size={17} className={groceriesLoading || transactionsLoading ? "spin" : ""} />
            <span>Perbarui</span>
          </button>
        </section>

        <div className="dashboard-store-row">
          <label htmlFor="active-store">TOKO AKTIF</label>
          <div className="store-select-wrap">
            <Store size={17} />
            <select
              id="active-store"
              value={activeStoreId ?? ""}
              onChange={(event) => setActiveStoreId(Number(event.target.value))}
              aria-label="Pilih toko aktif"
            >
              {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>
            <ChevronDown size={16} />
          </div>
          <button className="icon-button add-store-button" onClick={() => setStoreModalOpen(true)} aria-label="Tambah toko">
            <Plus size={19} />
          </button>
        </div>

        {notice && (
          <div className={`notice notice-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>
            {notice.type === "success" ? <CheckCircle2 size={19} /> : <AlertTriangle size={19} />}
            <span>{notice.message}</span>
            <button onClick={() => setNotice(null)} aria-label="Tutup notifikasi"><X size={17} /></button>
          </div>
        )}

        <section className="summary-grid" aria-label="Ringkasan toko">
          <article className="summary-card summary-sales">
            <div className="summary-card-top">
              <span className="summary-icon"><TrendingUp size={19} /></span>
              <span className="summary-trend"><ArrowUpRight size={14} /> Ringkasan</span>
            </div>
            <p>Total Penjualan</p>
            <strong className="summary-value">{money(stats?.totalSales ?? 0)}</strong>
            <small>Akumulasi penjualan toko</small>
          </article>
          <article className="summary-card">
            <div className="summary-card-top">
              <span className="summary-icon summary-icon-blue"><Boxes size={19} /></span>
              {lowStockCount > 0 && <span className="summary-alert"><ArrowDownRight size={14} /> Perlu dicek</span>}
            </div>
            <p>Jenis Barang</p>
            <strong className="summary-value">{groceries.length}<span> barang</span></strong>
            <small>{lowStockCount ? `${lowStockCount} barang stok menipis` : "Katalog barang toko Anda"}</small>
          </article>
          <article className="summary-card">
            <div className="summary-card-top">
              <span className="summary-icon summary-icon-amber"><ReceiptIcon /></span>
              <span className="summary-trend">{transactions.length} tercatat</span>
            </div>
            <p>Total Transaksi</p>
            <strong className="summary-value">{stats?.totalHistory ?? transactions.length}<span> transaksi</span></strong>
            <small>Riwayat transaksi tersimpan</small>
          </article>
        </section>

        <nav className="dashboard-tabs" aria-label="Navigasi utama">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`dashboard-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? "page" : undefined}
            >
              <Icon size={18} /><span>{label}</span>
              {id === "stores" && <span className="tab-count">{stores.length}</span>}
            </button>
          ))}
        </nav>

        {activeTab === "pos" && (
          <section className="pos-layout">
            <div className="catalog-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">KATALOG SEMBAKO</p>
                  <h2>Pilih barang</h2>
                </div>
                <button className="button button-primary small-add-button" onClick={openNewGrocery}>
                  <Plus size={17} /><span>Tambah Barang</span>
                </button>
              </div>
              <div className="search-field">
                <Search size={18} />
                <input aria-label="Cari barang" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama barang..." />
                {search && <button onClick={() => setSearch("")} aria-label="Hapus pencarian"><X size={16} /></button>}
              </div>
              {groceriesLoading ? (
                <div className="empty-panel"><RefreshCw className="spin" size={25} /><p>Memuat barang...</p></div>
              ) : filteredGroceries.length === 0 ? (
                <div className="empty-panel">
                  <span className="empty-icon"><Package size={25} /></span>
                  <h3>{search ? "Barang tidak ditemukan" : "Belum ada barang"}</h3>
                  <p>{search ? "Coba kata kunci yang berbeda." : "Tambahkan barang pertama untuk mulai berjualan."}</p>
                  {!search && <button className="button button-primary" onClick={openNewGrocery}><Plus size={17} /> Tambah Barang</button>}
                </div>
              ) : (
                <div className="product-grid">
                  {filteredGroceries.map((item) => {
                    const quantity = item.stock?.quantity ?? 0;
                    const selected = item.id === selectedGroceryId;
                    return (
                      <button
                        key={item.id}
                        className={`product-tile ${selected ? "selected" : ""} ${quantity <= 0 ? "out-of-stock" : ""}`}
                        onClick={() => {
                          if (quantity <= 0) return;
                          setSelectedGroceryId(item.id);
                          setPosAmount((current) => Math.min(current, quantity));
                          setPosSuccess(null);
                        }}
                        disabled={quantity <= 0}
                        aria-pressed={selected}
                      >
                        <span className="product-image">
                          {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <Package size={24} />}
                          {selected && <span className="selected-check"><Check size={14} /></span>}
                        </span>
                        <span className="product-info">
                          <strong>{item.name}</strong>
                          <span className="product-price">{money(item.price)} <small>/ {item.unit}</small></span>
                          <span className="product-stock">
                            <StockBadge quantity={quantity} />
                            <small>{quantity} {item.unit}</small>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="checkout-panel">
              <div className="checkout-heading">
                <span className="checkout-heading-icon"><ShoppingCart size={18} /></span>
                <div><p className="eyebrow">TRANSAKSI BARU</p><h2>Ringkasan belanja</h2></div>
              </div>
              {selectedGrocery ? (
                <form onSubmit={handleCheckout}>
                  <div className="checkout-product">
                    <span className="checkout-product-image">
                      {selectedGrocery.imageUrl ? <img src={selectedGrocery.imageUrl} alt="" /> : <Package size={23} />}
                    </span>
                    <div><strong>{selectedGrocery.name}</strong><small>{money(selectedGrocery.price)} / {selectedGrocery.unit}</small></div>
                    <button type="button" className="text-button" onClick={() => setSelectedGroceryId(null)}>Ubah</button>
                  </div>
                  <div className="quantity-row">
                    <div><strong>Jumlah</strong><small>Stok tersedia {selectedGrocery.stock?.quantity ?? 0} {selectedGrocery.unit}</small></div>
                    <div className="quantity-stepper">
                      <button type="button" onClick={() => setPosAmount((value) => Math.max(1, value - 1))} aria-label="Kurangi jumlah">−</button>
                      <input
                        aria-label="Jumlah barang"
                        type="number"
                        min={1}
                        max={selectedGrocery.stock?.quantity ?? 0}
                        value={posAmount}
                        onChange={(event) => setPosAmount(Math.max(1, Math.min(Number(event.target.value) || 1, selectedGrocery.stock?.quantity ?? 0)))}
                      />
                      <button type="button" onClick={() => setPosAmount((value) => Math.min(selectedGrocery.stock?.quantity ?? value, value + 1))} aria-label="Tambah jumlah">+</button>
                    </div>
                  </div>
                  <div className="checkout-total">
                    <span>Subtotal <small>({posAmount} {selectedGrocery.unit})</small></span>
                    <strong>{money(selectedGrocery.price * posAmount)}</strong>
                  </div>
                  <button className="button button-primary checkout-button" type="submit" disabled={posSubmitting}>
                    <ShoppingCart size={19} /> {posSubmitting ? "Memproses..." : "Bayar Sekarang"}
                  </button>
                </form>
              ) : (
                <div className="checkout-empty">
                  <span><ShoppingCart size={24} /></span>
                  <strong>Belum ada barang dipilih</strong>
                  <p>Pilih barang dari katalog untuk mulai transaksi.</p>
                </div>
              )}
              {posSuccess && <div className="checkout-success"><CheckCircle2 size={17} /><span>{posSuccess}</span></div>}
              <div className="checkout-hint"><ShieldCheckIcon /> Transaksi akan mengurangi stok secara otomatis.</div>
            </aside>
          </section>
        )}

        {activeTab === "inventory" && (
          <section className="content-panel">
            <div className="section-heading">
              <div><p className="eyebrow">KELOLA KATALOG</p><h2>Stok Barang</h2></div>
              <button className="button button-primary" onClick={openNewGrocery}><Plus size={17} /> Tambah Barang</button>
            </div>
            <div className="search-field inventory-search">
              <Search size={18} />
              <input aria-label="Cari barang" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama barang..." />
              {search && <button onClick={() => setSearch("")} aria-label="Hapus pencarian"><X size={16} /></button>}
            </div>
            {groceriesLoading ? <div className="empty-panel"><RefreshCw className="spin" size={25} /><p>Memuat stok barang...</p></div> : filteredGroceries.length === 0 ? (
              <div className="empty-panel"><span className="empty-icon"><Package size={25} /></span><h3>Belum ada barang</h3><p>Barang yang Anda tambahkan akan muncul di sini.</p></div>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr><th>Nama Barang</th><th>Satuan</th><th>Harga Jual</th><th>Jumlah Stok</th><th>Status</th><th className="actions-heading">Aksi</th></tr></thead>
                  <tbody>
                    {filteredGroceries.map((item) => {
                      const quantity = item.stock?.quantity ?? 0;
                      return (
                        <tr key={item.id}>
                          <td><div className="table-product">
                            <span className="table-product-image">{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <Package size={19} />}</span>
                            <strong>{item.name}</strong>
                          </div></td>
                          <td>{item.unit}</td><td className="table-money">{money(item.price)}</td>
                          <td><strong className="quantity-number">{quantity}</strong> <button className="text-button" onClick={() => { setStockEditGrocery(item); setNewStockQty(quantity); }}>Ubah stok</button></td>
                          <td><StockBadge quantity={quantity} /></td>
                          <td><div className="row-actions">
                            <button className="icon-button" onClick={() => openEditGrocery(item)} aria-label={`Ubah ${item.name}`}><Edit2 size={17} /></button>
                            <button className="icon-button danger-icon" onClick={() => handleDeleteGrocery(item)} aria-label={`Hapus ${item.name}`}><Trash2 size={17} /></button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "history" && (
          <section className="content-panel">
            <div className="section-heading">
              <div><p className="eyebrow">CATATAN PENJUALAN</p><h2>Riwayat Transaksi</h2></div>
              <span className="history-count">{transactions.length} transaksi</span>
            </div>
            {transactionsLoading ? <div className="empty-panel"><RefreshCw className="spin" size={25} /><p>Memuat riwayat...</p></div> : transactions.length === 0 ? (
              <div className="empty-panel"><span className="empty-icon"><History size={25} /></span><h3>Belum ada transaksi</h3><p>Transaksi yang selesai akan tercatat di sini.</p></div>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr><th>No. Transaksi</th><th>Nama Barang</th><th>Jumlah</th><th>Total Penjualan</th><th>Waktu</th></tr></thead>
                  <tbody>{[...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((transaction) => (
                    <tr key={transaction.id}>
                      <td><span className="transaction-id">#{transaction.id}</span></td>
                      <td><strong>{transaction.Grocery?.name ?? `Barang #${transaction.groceryId}`}</strong></td>
                      <td>{transaction.amount}</td><td className="table-money">{money(transaction.totalPrice)}</td>
                      <td><span className="transaction-time"><Clock3 size={15} />{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(transaction.createdAt))}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "stores" && (
          <section className="content-panel">
            <div className="section-heading">
              <div><p className="eyebrow">LOKASI USAHA</p><h2>Toko Saya</h2></div>
              <button className="button button-primary" onClick={() => setStoreModalOpen(true)}><Plus size={17} /> Tambah Toko</button>
            </div>
            {stores.length === 0 ? (
              <div className="empty-panel"><span className="empty-icon"><Store size={25} /></span><h3>Belum ada toko</h3><p>Buat toko untuk mulai mengelola barang dan transaksi.</p></div>
            ) : <div className="store-grid">{stores.map((store) => {
              const isActive = store.id === activeStoreId;
              return (
                <article key={store.id} className={`store-card ${isActive ? "current-store" : ""}`}>
                  <div className="store-card-top"><span className="store-card-icon"><Store size={21} /></span>{isActive && <span className="active-label"><CheckCircle2 size={14} /> Toko aktif</span>}</div>
                  <h3>{store.name}</h3>
                  <p><MapPin size={15} />{store.address}</p>
                  <p><Activity size={15} />{store.phone}</p>
                  <button className={`button ${isActive ? "button-secondary" : "button-primary"} store-switch`} disabled={isActive} onClick={() => setActiveStoreId(store.id)}>
                    {isActive ? "Sedang digunakan" : "Pilih toko ini"}
                  </button>
                </article>
              );
            })}</div>}
            {activeStore && <p className="stores-footnote">Data yang ditampilkan saat ini berasal dari <strong>{activeStore.name}</strong>.</p>}
          </section>
        )}

        <footer className="dashboard-footer"><span>Sembako Pro</span> membantu usaha Anda tumbuh, satu transaksi pada satu waktu.</footer>
      </main>

      {groceryModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setGroceryModalOpen(false); resetGroceryForm(); } }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="grocery-modal-title">
            <div className="modal-header"><div><p className="eyebrow">KATALOG SEMBAKO</p><h2 id="grocery-modal-title">{editingGrocery ? "Ubah Barang" : "Tambah Barang"}</h2></div><button className="icon-button" onClick={() => { setGroceryModalOpen(false); resetGroceryForm(); }} aria-label="Tutup"><X size={20} /></button></div>
            <form className="modal-form" onSubmit={handleSaveGrocery}>
              <label>Nama Barang<input value={gName} onChange={(event) => setGName(event.target.value)} placeholder="Contoh: Beras Ramos" required /></label>
              <div className="form-grid">
                <label>Satuan<input value={gUnit} onChange={(event) => setGUnit(event.target.value)} placeholder="Kg, Pcs, Dus" required /></label>
                <label>Harga Jual<div className="currency-input"><span>Rp</span><input type="number" min="0" value={gPrice} onChange={(event) => setGPrice(event.target.value === "" ? "" : Number(event.target.value))} placeholder="0" required /></div></label>
              </div>
              {!editingGrocery && <label>Stok Awal<input type="number" min="0" value={gQuantity} onChange={(event) => setGQuantity(event.target.value === "" ? "" : Number(event.target.value))} placeholder="0" /></label>}
              {groceryFormError && <div className="notice notice-error" role="alert"><AlertTriangle size={17} /><span>{groceryFormError}</span></div>}
              <label>Unggah Foto <span className="optional">(atau isi URL di bawah)</span><input type="file" accept="image/*" onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (file && !file.type.startsWith("image/")) {
                  setGroceryFormError("Pilih file gambar yang valid.");
                  event.target.value = "";
                  return;
                }
                setGImageFile(file);
                setGroceryFormError(null);
              }} /></label>
              <label>URL Gambar <span className="optional">(atau unggah foto di atas)</span><input type="url" value={gImageUrl} onChange={(event) => { setGImageUrl(event.target.value); setGImageFile(null); setGroceryFormError(null); }} placeholder="https://..." /></label>
              <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => { setGroceryModalOpen(false); resetGroceryForm(); }}>Batal</button><button type="submit" className="button button-primary" disabled={grocerySaving}>{grocerySaving ? gImageFile ? "Mengunggah foto..." : "Menyimpan..." : editingGrocery ? "Simpan Perubahan" : "Tambah Barang"}</button></div>
            </form>
          </section>
        </div>
      )}

      {stockEditGrocery && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setStockEditGrocery(null); }}>
          <section className="modal-card modal-compact" role="dialog" aria-modal="true" aria-labelledby="stock-modal-title">
            <div className="modal-header"><div><p className="eyebrow">PERBARUI INVENTARIS</p><h2 id="stock-modal-title">Ubah Stok Barang</h2></div><button className="icon-button" onClick={() => setStockEditGrocery(null)} aria-label="Tutup"><X size={20} /></button></div>
            <form className="modal-form" onSubmit={handleUpdateStock}>
              <p className="modal-context">{stockEditGrocery.name} · saat ini {stockEditGrocery.stock?.quantity ?? 0} {stockEditGrocery.unit}</p>
              <label>Jumlah stok baru ({stockEditGrocery.unit})<input type="number" min="0" value={newStockQty} onChange={(event) => setNewStockQty(Math.max(0, Number(event.target.value)))} required /></label>
              <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setStockEditGrocery(null)}>Batal</button><button type="submit" className="button button-primary" disabled={stockSaving}>{stockSaving ? "Menyimpan..." : "Simpan Stok"}</button></div>
            </form>
          </section>
        </div>
      )}

      <CreateStoreModal isOpen={storeModalOpen} onClose={() => setStoreModalOpen(false)} />
    </div>
  );
}

function ReceiptIcon() {
  return <History size={19} />;
}

function ShieldCheckIcon() {
  return <CheckCircle2 size={16} />;
}
