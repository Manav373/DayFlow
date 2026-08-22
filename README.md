# 🚀 DayFlow — Unified HRMS Enterprise Portal (Full-Stack Monorepo)

> A modern, human-centered enterprise Human Resource Management System (HRMS) built with **React 18 + TypeScript + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + TypeScript** (Backend REST API), based directly on the Google Stitch UI design system and Odoo HR workflows.

---

## 🏗️ Architecture & Project Structure

```
DayFlow/
├── backend/                       # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── routes/                # /api/auth, /api/employees, /api/attendance, /api/leaves, /api/payroll
│   │   ├── data/                  # In-memory Odoo-style seed database & persistence
│   │   ├── types/                 # Backend TypeScript data contracts
│   │   └── server.ts              # Express server setup (port 5000)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # React 18 + TypeScript + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Sidebar, TopNav, AppLayout
│   │   │   ├── common/            # Badge, Modal, StatCard
│   │   │   ├── calendar/          # Interactive LeaveCalendar month view
│   │   │   └── kiosk/             # KioskModal (PIN / Badge punch)
│   │   ├── context/               # AuthContext (RBAC), HRMSContext
│   │   ├── data/                  # Rich initial dataset
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Sign In (with 1-click persona quick login)
│   │   │   ├── Register.tsx       # Sign Up (with Role selection)
│   │   │   ├── AdminDashboard.tsx # Operations pulse & leave approvals
│   │   │   ├── EmployeeDashboard.tsx # Self-service portal & punch clock
│   │   │   ├── EmployeeDirectory.tsx # Directory with Grid & Table views
│   │   │   ├── EmployeeDetail.tsx # Odoo-style Tabbed Profile (Work / Private / HR)
│   │   │   ├── Attendance.tsx     # Biometric logs & CSV export
│   │   │   ├── TimeOff.tsx        # Calendar & Table view modes
│   │   │   ├── Payroll.tsx        # Disbursement runs & printable payslips
│   │   │   ├── Reports.tsx        # Recharts visual analytics
│   │   │   └── Settings.tsx       # Policy governance & shifts
│   │   └── App.tsx                # Protected routes & role routing
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── package.json
```

---

## ✨ Key Features & Flowchart Modules

### 🔐 **1. Authentication & Role-Based Access Control (RBAC)**
* **Sign In (`/login`)**: Secure credential authentication with instant **1-Click Demo Login** for **Admin**, **HR Officer**, and **Employee** personas.
* **Sign Up (`/register`)**: Account registration with dynamic role assignment.

### 🏢 **2. Odoo-Style Tabbed Employee Profile (`/employee/:id`)**
* **Work Information**: Work address, Department, Job Position, Manager/Approver, Working hours schedule, Date of joining.
* **Private Information**: Personal email & phone, Emergency contact, Bank details (Account Number, Bank Name, Routing/IFSC), Identification (SSN / PAN), Residential address.
* **HR Settings**: RFID Badge ID, Kiosk Security PIN, System User Role, Base compensation.

### 📅 **3. Interactive Time-Off Calendar (`/time-off`)**
* **Month Grid View**: Visual calendar highlighting team member leaves, approved/pending requests, and company holidays.
* **Request Table View**: High-density table with instant **Approve** / **Reject** triggers for managers.

### ⏱️ **4. Office Kiosk Mode (`TopNav -> Kiosk Punch`)**
* Fast 4-digit PIN keypad or employee selection for touchless office punch-in / punch-out.

### 💳 **5. Payroll & Printable Payslips (`/payroll`)**
* Automated calculation of basic salary, HRA, allowances, PF, and tax withholdings.
* Printable payslip statement dialog.

---

## 🚀 Quick Setup & Run

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm`

### 1. Install all dependencies
```bash
# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install
```

### 2. Start the Backend REST API (Port 5000)
```bash
cd backend
npm run dev
```

### 3. Start the Frontend Application (Port 5173)
```bash
cd frontend
npm run dev
```

---

## 📄 License
MIT License
