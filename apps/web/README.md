# TransitOps Web Dashboard (`apps/web`)

This directory contains the complete React 18, TypeScript, and Vite frontend for **TransitOps**, a centralized transport operations and fleet management platform.

For full project architecture, PRD compliance tables, business logic details, and RBAC matrix, please see the [Root README](../../README.md).

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production & check TypeScript
npm run build
```

The development server runs at **http://localhost:3000/** by default.

---

## 📖 What's Inside (`src/`)

- **`store/`**: Local state database powered by **Zustand** with `persist` middleware. Stores (`vehicleStore`, `driverStore`, `tripStore`, `maintenanceStore`, `financeStore`, `authStore`) enforce all 11 business rules from the PRD locally (`localStorage`).
- **`components/ui/`**: Reusable glassmorphic UI components (`Select`, `ConfirmDialog`, `StatusBadge`, `Stepper`, `Table`, `KPICard`, `Button`, `Input`).
- **`pages/`**: 9 functional application pages:
  - `Auth/Login.tsx`: 4-role demo selector (`Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`).
  - `Dashboard/Dashboard.tsx`: Bento grid KPI tracking (`Active/Available Vehicles`, `Utilization %`).
  - `Vehicles/Vehicles.tsx`: Fleet registry, capacity & odometer tracking, and soft retirement.
  - `Drivers/Drivers.tsx`: Driver compliance, safety score bars (`0-100`), license expiry warning badges, and suspend/reinstate controls.
  - `Trips/Trips.tsx`: Split dispatch board with live cargo weight vs. capacity validation (`Cargo > Capacity` blocks dispatch!) and multi-stage lifecycle transitions (`Draft` → `Dispatched` → `Completed`).
  - `Maintenance/Maintenance.tsx`: Service logs with automated status locking (`Available` ↔ `In Shop`).
  - `Finance/Finance.tsx`: Fuel logs & general expenses (`Tolls`, `Repairs`) with automatic `Total Operational Cost` computation.
  - `Reports/Reports.tsx`: KPI summaries, Recharts monthly revenue and top costliest vehicle charts, ROI formula calculation, and **1-Click CSV Export**.
  - `Settings/Settings.tsx`: General configuration and interactive RBAC matrix display.
- **`types.ts`**: Complete entity definitions and enums matching PRD Section 4.
