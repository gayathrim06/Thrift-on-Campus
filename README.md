# 🎓 Thrift in Campus

> **Buy Smart. Sell Easy. Thrift on Campus.**

A modern, full-stack campus marketplace where college students buy and sell pre-owned gear, textbooks, hostel essentials, and electronics.

---

## 🚀 Quick Start (For Anyone Downloading from GitHub)

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher installed on your computer)

### 1. Clone & Install
```bash
git clone <YOUR-GITHUB-REPO-URL>
cd thrift-in-campus
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root folder (or copy from `.env.example`):
```bash
# On Mac/Linux:
cp .env.example .env.local

# On Windows (PowerShell):
Copy-Item .env.example .env.local
```

Inside `.env.local`, you only need:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="thrift-campus-dev-secret-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database (Zero Installation Required — Uses SQLite)
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🔑 Demo Login Accounts

| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `admin123` | Review & approve/reject student listings |
| **Student** | `student@campus.edu` | `student123` | Browse, save items, list products for sale |
| **Student 2** | `arjun@campus.edu` | `student123` | Other student accounts to test interactions |

---

## 📱 Mobile-First Features
- **Floating Native Bottom Bar**: Smooth touch navigation on phones.
- **2-Column Responsive Product Grid**: Touch-friendly with active press states.
- **Sticky Mobile Contact Bar**: Connect directly with student sellers via email or WhatsApp.
- **Spring Animations**: Fluid micro-interactions powered by Framer Motion.

---

## 📁 Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS tokens
- **Animations**: Framer Motion + Canvas Confetti
- **Database**: SQLite with Prisma ORM (zero external db installation required)
- **Authentication**: NextAuth.js (Credentials Provider + bcrypt)
