# ⚡ TransitOps — Smart Transport Operations Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-00D4FF?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/stack-React_18_%7C_TypeScript_%7C_Vite_%7C_Zustand-00C896?style=for-the-badge)
![Status](https://img.shields.io/badge/status-PRD_Compliant_%26_Verified-FFB800?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-FF3366?style=for-the-badge)

*A centralized, modern web platform that digitizes vehicle, driver, dispatch, maintenance, and financial analytics for transport and logistics fleets — replacing spreadsheets and manual logbooks.*

---

</div>

## 📖 Table of Contents

- [🎯 The Problem We Solve](#-the-problem-we-solve)
- [🚀 What We Built (Key Features)](#-what-we-built-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🏗️ Architecture & Implementation Pipeline](#-architecture--implementation-pipeline)
- [🛡️ Automated Business Rules Enforced](#-automated-business-rules-enforced)
- [🔐 Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [💻 Quick Start & Demo Guide](#-quick-start--demo-guide)
- [📂 Project Structure](#-project-structure)

---

## 🎯 The Problem We Solve

Transport and logistics companies managing mid-to-large fleets via spreadsheets and paper logbooks constantly face operational chaos:

1. **Double-Booking & Scheduling Conflicts**: Vehicles in maintenance or drivers with expired licenses get dispatched by mistake.
2. **Underutilized Fleet Assets**: Lack of real-time visibility leads to idle vehicles and inaccurate trip scheduling.
3. **Overweight Cargo Dispatches**: No automated validation to stop dispatchers from assigning 800kg loads to 500kg capacity vans, risking vehicle damage and regulatory fines.
4. **Missed Maintenance & Safety Blinds**: Service schedules fall through the cracks, and driver safety scores (`0-100`) are tracked manually or ignored completely.
5. **Inaccurate Expense Tracking & Blind ROI**: Fuel receipts, toll costs, and repair bills are siloed across disparate departments, making it impossible to calculate true cost-per-kilometer or per-vehicle Return on Investment (**ROI**).

**TransitOps** eliminates these pain points by introducing an end-to-end, automated digital operations platform with strict client-side state transitions, automated eligibility guards, and real-time financial analytics.

---

## 🚀 What We Built (Key Features)

### 🌟 Premium Glassmorphism & Dynamic UI/UX

- **Sleek Dark Mode Aesthetics**: Built using tailored dark color tokens (`#0A0A0F` charcoal background, `#12121A` slate cards, `rgba(255,255,255,0.05)` glassmorphism cards with glowing cyan/emerald borders).
- **Interactive Micro-Animations**: Powered by **Framer Motion** and custom CSS animations for smooth card entry, active navigation indicators, and modal transitions.

### 📊 Comprehensive 9-Module Suite

1. **Interactive Role Selector (`/login`)**: 1-click demo login enabling instant testing across **4 distinct RBAC roles** (`Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`).
2. **Executive Command Dashboard (`/dashboard`)**: Bento grid KPI layout surfacing real-time counts (`Active Vehicles`, `Available Vehicles`, `In Maintenance`, `Drivers On Duty`), **Fleet Utilization Percentage**, and unified recent activity feeds.
3. **Fleet Registry & Lifecycle (`/vehicles`)**: Full CRUD management of trucks, vans, buses, and cars. Tracks acquisition costs, max load capacities, and odometer readings. Supports soft-retiring (`RETIRED` status).
4. **Driver Profiles & Safety Compliance (`/drivers`)**: Tracks driver licensing categories, safety scores (`0-100` progress indicators), and automated license expiration warnings (`Expired` or `Expiring within 30 days`). Safety Officers can `Suspend` and `Reinstate` drivers.
5. **Split-Screen Trip Dispatcher (`/trips`)**: Left pane features an intelligent creation form with live capacity validation; right pane displays a real-time **Live Board** with interactive status transitions (`DRAFT` → `DISPATCHED` → `COMPLETED` / `CANCELLED`) and a visual lifecycle **Stepper**.
6. **Maintenance & Service Records (`/maintenance`)**: Log vehicle repairs and inspections. Automatically locks vehicles into `IN_SHOP` status to prevent dispatching, and restores them to `AVAILABLE` upon closure.
7. **Fuel & General Expense Ledger (`/finance`)**: Split tabs for logging fuel purchases (`liters x cost`) and miscellaneous operational expenses (`Tolls`, `Maintenance`, `Other`). Automatically computes exact **Total Operational Costs**.
8. **Automated Analytics & Reporting (`/reports`)**:
   - **4 KPI Cards**: Fuel Efficiency (`km/l`), Fleet Utilization (`%`), Operational Cost (`₹`), and Vehicle ROI (`%`).
   - **Interactive Charts**: Monthly Revenue vs. Top 5 Costliest Vehicles rendered via **Recharts**.
   - **1-Click CSV Export**: Instantly compiles all fleet metrics, top costliest vehicles, and monthly data into a downloadable `.csv` spreadsheet.
9. **Settings & RBAC Matrix (`/settings`)**: Configurable depot names, currency formatting (`₹`), and an interactive visualization of the role vs. module access matrix.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale & Usage |
| :--- | :--- | :--- |
| **Core Framework** | **React 18 + Vite** | Blazing-fast hot module replacement (HMR), component-driven architecture, and optimized production bundling. |
| **Language** | **TypeScript (v5.5)** | Strict type safety ensuring 100% contract adherence across complex vehicle, driver, and trip domain models. |
| **State Management** | **Zustand + Persist Middleware** | Lightweight, high-performance local state management. Acts as an in-memory database with automatic `localStorage` synchronization. |
| **Styling & Design** | **TailwindCSS (v3.4)** | Utility-first design system with custom design tokens (`charcoal`, `slate`, `cyan`, `emerald`, `crimson`, `amber`, and `glass` effects). |
| **Animations** | **Framer Motion** | Physics-based spring animations, interactive button feedback (`whileHover`/`whileTap`), and smooth page transitions. |
| **Data Visualization** | **Recharts** | Responsive, SVG-based bar charts and horizontal cost breakdown graphs. |
| **UI Primitives** | **Radix UI + Lucide Icons** | Accessible headless dialog modals, tooltips, tabs, and crisp modern iconography. |

---

## 🏗️ Architecture & Implementation Pipeline

We designed TransitOps with a decoupled, modular pipeline so that our local state persistence layer can easily be swapped for a live backend (Prisma/Node.js/PostgreSQL) with **zero changes to the UI components**:

```
+-------------------------------------------------------------------------------+
|                             TRANSITOPS REACT UI                               |
|                                                                               |
|  [Dashboard]   [Vehicles]   [Drivers]   [Trips]   [Maintenance]   [Reports]   |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                            COMPONENT & HOOK LAYER                             |
|                                                                               |
|     Select.tsx        ConfirmDialog.tsx       StatusBadge.tsx    Stepper.tsx  |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                       ZUSTAND PERSISTENT LOCAL STORAGE                        |
|   (Fully automated Client-Side Database with Atomic Transaction Guards)       |
|                                                                               |
|  [vehicleStore] <---> [driverStore] <---> [tripStore] <---> [maintenanceStore]|
|         ^                                      ^                              |
|         +--------------------------------------+------------------------------+
|                                     |                                         |
|                                     v                                         |
|                             [financeStore]                                    |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                              BROWSER LOCALSTORAGE                             |
|  (`transitops-vehicles`, `transitops-drivers`, `transitops-trips`, etc.)      |
+-------------------------------------------------------------------------------+
```

### Key Architectural Pipeline Decisions

1. **Normalized Store Domain Separation**: Instead of one monolithic state file, entities are separated into `vehicleStore`, `driverStore`, `tripStore`, `maintenanceStore`, and `financeStore`.
2. **Cross-Store Atomic Transactions**: When a trip transitions to `DISPATCHED`, `tripStore` synchronously invokes `useVehicleStore.getState().setVehicleStatus(...)` and `useDriverStore.getState().setDriverStatus(...)`. This guarantees **zero data inconsistency** across the app.
3. **Pure Client-Side Computation**: Complex aggregates like **Fleet Utilization %** `((Active / Non-Retired) * 100)` and **Vehicle ROI %** `((Revenue - Operational Costs) / Acquisition Cost) * 100` are computed dynamically via memoized selectors, eliminating stale or out-of-sync KPIs.

---

## 🛡️ Automated Business Rules Enforced

TransitOps automatically enforces all 11 core business logic requirements from the PRD directly inside the state mutation methods:

| # | Business Rule | Enforced Where | How It Works |
| :-: | :--- | :--- | :--- |
| **1** | Unique Registration Numbers | `vehicleStore.addVehicle()` | Rejects vehicle creation if `registration_number` already exists in registry. |
| **2** | Unique License Numbers | `driverStore.addDriver()` | Rejects driver creation if `license_number` already exists. |
| **3** | Driver License Expiry Check | `tripStore.createTrip()` | Blocks trip creation if driver's `license_expiry_date` is past the current date. |
| **4** | Double-Dispatch Prevention | `tripStore.createTrip()` | Verifies that neither the selected vehicle nor driver is currently assigned to another `DRAFT` or `DISPATCHED` trip. |
| **5** | Cargo vs. Capacity Guard | `tripStore.createTrip()` | Checks if `cargo_weight_kg > vehicle.max_load_capacity_kg`. Displays a red alert banner and blocks dispatch if exceeded. |
| **6** | Atomic Dispatch Lock | `tripStore.dispatchTrip()` | Atomically updates both vehicle status and driver status to `ON_TRIP` upon dispatch. |
| **7** | Trip Completion & Odometer | `tripStore.completeTrip()` | Restores vehicle and driver to `AVAILABLE`, logs actual distance and fuel consumed, and adds actual distance to `vehicle.odometer_km`. |
| **8** | Trip Cancellation Rollback | `tripStore.cancelTrip()` | Immediately restores vehicle and driver to `AVAILABLE` without altering odometer readings. |
| **9** | Maintenance Service Lock | `maintenanceStore.createLog()`| Automatically locks vehicle status to `IN_SHOP` when a new service record is created. |
| **10**| Maintenance Closure Unlock| `maintenanceStore.closeLog()` | Checks if other open maintenance records exist for the vehicle; if none, restores status to `AVAILABLE`. |
| **11**| Strict State Machine | `tripStore` & `maintenanceStore`| Enforces valid transition paths (`DRAFT` → `DISPATCHED` → `COMPLETED` / `CANCELLED`). Rejects illegal state jumps. |

---

## 🔐 Role-Based Access Control (RBAC)

The application includes full RBAC enforcement across 4 distinct user roles:

| Role | Fleet Module | Drivers Module | Trips Module | Maintenance | Finance Module | Reports & Analytics | Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Fleet Manager** | 🟢 **Full** | 🟢 **Full** | 🟡 View | 🟢 **Full** | 🟡 View | 🟢 **Full** | 🟢 **Full** |
| **Dispatcher** | 🟡 View | 🔴 None | 🟢 **Full** | 🔴 None | 🔴 None | 🔴 None | 🔴 None |
| **Safety Officer** | 🔴 None | 🟢 **Full** *(Suspend)* | 🟡 View | 🔴 None | 🔴 None | 🔴 None | 🔴 None |
| **Financial Analyst**| 🟡 View | 🔴 None | 🟡 View | 🔴 None | 🟢 **Full** | 🟢 **Full** | 🔴 None |

---

## 💻 Quick Start & Demo Guide

### 1. Installation

Ensure you have **Node.js (v18+)** installed. Clone the repository and install dependencies:

```bash
# Clone the project repository
git clone <repository-url>
cd Oddo-Hackthon-project

# Navigate to the frontend web application and install dependencies
cd apps/web
npm install
```

### 2. Run Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open **<http://localhost:3000/>** in your browser.

### 3. Verification Build (Optional)

To verify that the TypeScript compiler and Vite production bundling compile cleanly with zero errors:

```bash
npm run build
```

*(Transforms 2,846+ modules into a compressed, production-ready `dist/` bundle).*

### 🧪 Suggested 2-Minute Walkthrough

1. **Role Switcher**: On the Login screen, click **Dispatcher** and sign in. Notice how you have full control over `Trips`, but read-only access to `Vehicles`.
2. **Test Capacity Validation**: Go to **Trips** (`/trips`). Select `VAN-05` (500 kg capacity) and enter `750 kg` into the Cargo Weight field. Watch the intelligent red error banner block dispatch!
3. **Dispatch a Trip**: Change the weight to `450 kg` and create the trip. Click **Dispatch** on the right pane (`Live Board`). Go back to **Vehicles** and verify that `VAN-05` is now automatically marked `ON TRIP` (`ON_TRIP`).
4. **Complete Trip**: Return to **Trips**, click **Complete**, input `115 km` and `45 liters` of fuel. Check **Vehicles** again — `VAN-05` is now `AVAILABLE` and its odometer has increased!
5. **Generate Report**: Go to **Reports** (`/reports`) and click **Export CSV** to download all operational metrics instantly.

---

## 📂 Project Structure

```text
Oddo-Hackthon-project/
├── apps/
│   └── web/                   # Frontend React + Vite Application
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/    # Sidebar, Topbar, CommandPalette, AppLayout
│       │   │   └── ui/        # Button, Input, Select, Table, Dialog, StatusBadge, Stepper, KPICard
│       │   ├── pages/         # 9 Complete functional application pages:
│       │   │   ├── Auth/      # Login.tsx (Role selector)
│       │   │   ├── Dashboard/ # Dashboard.tsx (Bento KPI grid & activity feed)
│       │   │   ├── Vehicles/  # Vehicles.tsx (Registry, CRUD, & retirement)
│       │   │   ├── Drivers/   # Drivers.tsx (Driver management & safety scoring)
│       │   │   ├── Trips/     # Trips.tsx (Split trip creation & Live Board)
│       │   │   ├── Maintenance/ # Maintenance.tsx (Service log & automated status locks)
│       │   │   ├── Finance/   # Finance.tsx (Fuel logs, expenses, & cost totals)
│       │   │   ├── Reports/   # Reports.tsx (Charts, ROI calculation, & CSV Export)
│       │   │   └── Settings/  # Settings.tsx (General configuration & RBAC table)
│       │   ├── store/         # Zustand stores with localStorage persist middleware:
│       │   │   ├── authStore.ts
│       │   │   ├── vehicleStore.ts
│       │   │   ├── driverStore.ts
│       │   │   ├── tripStore.ts
│       │   │   ├── maintenanceStore.ts
│       │   │   └── financeStore.ts
│       │   ├── lib/           # Utility functions (Currency & date formatting, cn helper)
│       │   ├── types.ts       # Centralized TypeScript interfaces and enums
│       │   ├── App.tsx        # Application routing & RBAC guards
│       │   └── main.tsx       # Application entry point
│       ├── index.html         # Web HTML entry
│       ├── package.json       # Dependencies & scripts
│       ├── tailwind.config.js # Design system tokens & animations
│       └── tsconfig.json      # TypeScript compiler settings
├── apps/api/                  # Backend API scaffolding (Prisma / Node.js)
└── packages/shared/           # Shared monorepo utilities
```

---

<div align="center">

**Built with ❤️ for the Oddo Hackathon | Powered by Advanced Agentic Coding**

</div>
