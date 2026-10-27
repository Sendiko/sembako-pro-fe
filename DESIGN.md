---
name: Warung Modern UI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4943'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7a73'
  outline-variant: '#bdc9c1'
  surface-tint: '#006c4e'
  primary: '#005d42'
  on-primary: '#ffffff'
  primary-container: '#047857'
  on-primary-container: '#9ffdd3'
  inverse-primary: '#7bd8b1'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#00567d'
  on-tertiary: '#ffffff'
  tertiary-container: '#0070a0'
  on-tertiary-container: '#d7ecff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#97f5cc'
  primary-fixed-dim: '#7bd8b1'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system serves Indonesian micro, small, and medium neighborhood grocery merchants (*toko kelontong* / *toko sembako*). The core ethos balances modern retail operational clarity with warm, approachable familiarity. The experience must feel frictionless under challenging operating conditions: harsh sunlight through open shopfronts, one-handed operation while holding stock or scanning items, and high-frequency, rapid transactions.

### Aesthetic Foundation
- **Design Archetype:** Clean, High-Contrast Utilitarianism with warm tactile undertones.
- **Tone of Voice:** Direct, reassuring, and commercially empowering. Copy defaults strictly to standardized Indonesian retail terminology (*Kasir*, *Stok Barang*, *Total Penjualan*, *Riwayat Transaksi*).
- **Visual Tenets:**
  - **Zero Glare Friction:** High contrast ratios (exceeding WCAG AAA for numeric figures and stock alerts) ensure legibility under direct daylight.
  - **Tactile Ergonomics:** Minimum 48px hit targets to accommodate rapid tapping on budget Android hardware.
  - **Financial Reassurance:** Prominent, unambiguous numeric layouts using tabular figures specifically optimized for Indonesian Rupiah formatting (`Rp 150.000`).

## Colors

The palette is engineered around trustworthy agricultural commerce (Emerald Green), high-urgency transactional actions and low-stock warnings (Warm Amber), and high-density legibility (Deep Slate).

### Role Allocations
- **Primary (`#047857` Emerald Deep):** The foundational anchor. Used for primary app bars, checkout triggers, core financial summaries, and confirmation banners. Communicates stability and vitality.
- **Primary Interactive (`#10B981` Emerald Fresh):** Used as high-visibility accents, interactive toggle active states, and success indicators (*Stok Aman*).
- **Secondary (`#F59E0B` Amber Glow):** Reserved for low-stock warnings (*Stok Menipis*), critical alerts, and quick-action POS triggers that demand immediate visual priority.
- **Tertiary (`#0EA5E9` Sky Blue):** Used for non-fiscal metadata, category tagging, and sync/cloud connectivity states.
- **Neutral Deep (`#0F172A` Slate Dark):** Primary text and numeric readouts. Provides crisp visual punch against warm tinted backdrops.
- **Neutral Muted (`#64748B` Slate Gray):** Secondary metadata, helper notes, and divider outlines.
- **Surface Canvas (`#F8FAFC` Crisp Slate White):** Primary application canvas.
- **Surface Accent (`#F0FDF4` Mint Tint):** Cards containing active POS balances, safe stock notifications, and summary hero modules.
- **Critical / Danger (`#EF4444` Crimson):** Stock depleted states (*Stok Habis*), return orders, and deletion triggers.

## Typography

Plus Jakarta Sans provides geometric balance, broad open counters, and Indonesian linguistic heritage. It maintains total clarity at small point sizes when displaying dense inventory details (e.g., *Dus, Renceng, Slop, Pcs*).

### Currency & Numerical Rules
- Enable tabular figures (`font-variant-numeric: tabular-nums`) across all numerical displays to prevent alignment jitter during rapid recalculations on the POS screen.
- Currency symbols (`Rp`) must always be weighted identically to their corresponding numeric string, never superscripted or separated by line breaks.
- Use `display-lg-mobile` exclusively for daily metrics (e.g., *Total Penjualan Hari Ini*).

## Layout & Spacing

A strict 4px/8px incremental rhythm is optimized for fluid single-hand phone usage (360px–428px viewport widths).

### Viewport Adaptation & Breakpoints
- **Mobile Handheld (320px – 599px):** 1-column stack. Outer canvas margins: `margin` (`1rem`). Gutter between grid inventory tiles: `gutter` (`1rem`).
- **Tablet / Countertop Terminal (600px – 1024px):** 2-column split. Left pane: Fixed 400px transaction bill & keypad (*Kasir*). Right pane: Fluid responsive grid (2 to 4 columns) for product selection catalogs (*Katalog Sembako*).
- **Compact Verticality:** In list-heavy modes (such as Stock Check), elements use `space-sm` vertically and `space-md` horizontally to maximize visible rows per screen.

## Elevation & Depth

This system avoids heavy drop shadows that clutter dense data on low-brightness displays. Depth is expressed through crisp, low-contrast structural outlines combined with tinted ambient diffusion.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC`. Zero elevation, zero outline.
- **Level 1 (Card & Module Default):** Surface `#FFFFFF`, border `1px solid #E2E8F0`, shadow `0 1px 3px rgba(15, 23, 42, 0.05)`. Used for standard product inventory rows, customer ledgers, and transaction items.
- **Level 2 (Active Modals & Drawer Sheets):** Surface `#FFFFFF`, border `1px solid #CBD5E1`, shadow `0 8px 24px -4px rgba(4, 120, 87, 0.12)`. Used for quick-add modals (*Tambah Produk*) and POS category pickers.
- **Level 3 (Fixed Bottom Action Bars & Keypads):** Surface `#FFFFFF`, border-top `1px solid #E2E8F0`, shadow `0 -4px 16px rgba(15, 23, 42, 0.06)`. Houses fixed action triggers such as "Bayar Sekarang" and persistent POS summary drawers.

## Shapes

The design uses a balanced rounded shape language (Base Radius: 8px / `0.5rem`).

### Corner Radius Mapping
- **Buttons, Inputs, and Badges:** `rounded` (`0.5rem` / 8px). Delivers a confident, clean tactile feel without feeling overly casual.
- **Cards, Module Containers, and Bottom Sheets:** `rounded-lg` (`1rem` / 16px). Softens large analytical sections (*Ringkasan Penjualan*).
- **Full Pill Utility:** Used exclusively for stock counter increments/decrements (`+` and `-` steppers) and filter chips to distinguish them from standard call-to-action buttons.

## Components

### Buttons
- **Primary POS Action (*Bayar*, *Tambah Produk*):** Min-height 52px. Fill `#047857`, text `#FFFFFF`, typography `label-lg`. Active state shifts to `#065F46` with an inner shadow.
- **Secondary Action (*Cetak Struk*, *Simpan Draft*):** Min-height 48px. Fill `#F0FDF4`, text `#047857`, border `1.5px solid #10B981`.
- **Destructive Action (*Batalkan Transaksi*):** Min-height 48px. Fill `#FEF2F2`, text `#DC2626`, border `1px solid #FCA5A5`.

### Status Badges (*Tag Status Stok*)
Stock badges must have unmistakable color and typographic distinction:
- **Stok Aman:** Pill container. Background `#DCFCE7`, text `#15803D`, border `1px solid #86EFAC`. Icon: Checked circle.
- **Menipis:** Pill container. Background `#FEF3C7`, text `#B45309`, border `1px solid #FCD34D`. Icon: Exclamation triangle. Triggers auto-highlight when quantity drops below store threshold (e.g., < 5 pcs).
- **Habis:** Pill container. Background `#FEE2E2`, text `#B91C1C`, border `1px solid #FCA5A5`. Typography `label-sm` bold.

### Inventory & POS Cards
- **Product Row Card:** Surface `#FFFFFF`, padding `space-md`, border `1px solid #E2E8F0`. Features high-contrast price readouts on the right, bold product titles on the left, and inventory count in `body-sm` muted slate.
- **Quick-Sale POS Tile:** Surface `#FFFFFF`, active border `#047857` (2px on select). Includes thumbnail placeholder, compact two-line title, bold currency indicator, and integrated increment stepper.

### Numeric POS Input & Keypads
- Custom touch keypad buttons must be minimum 60px height.
- Background `#FFFFFF` with active state `#F1F5F9`. Number text `headline-md` in `#0F172A`.
- Clear backspace button with high-contrast slate icon.

### Form Inputs (*Harga Kulak, Harga Jual, Barcode*)
- Height: 48px.
- Inactive state: Border `1.5px solid #CBD5E1`, background `#FFFFFF`.
- Focused state: Border `2px solid #047857`, background `#FFFFFF`, subtle outline ring `rgba(4, 120, 87, 0.15)`.
- Currency prefix: A locked, non-editable `Rp` tag embedded inside the left padding with background `#F1F5F9`.