# 🎓 s4095471-s4093817-a2 — Tutor / Lab Assistant Job Platform

A full-stack **React + TypeScript + Next.js** application designed to help students apply for **tutor and lab assistant jobs**.  
This project was completed as part of the **RMIT Full Stack Development** course (A2).

---

## 👨‍💻 Group Details

| Name         | Student ID | Email                                      |
|--------------|------------|--------------------------------------------|
| Luca Grosso  | s4093817   | s4093817@student.rmit.edu.au               |
| Alysha Khan  | s4095471   | s4095471@student.rmit.edu.au               |

👉 **GitHub Repository:** https://github.com/rmit-fsd-2025-s1/s4095471-s4093817-a2  
👉 **Branch:** `main` (contains the most recent version)

---

## 🚀 Key Features
- 📝 **Account Management** – create, log in, and manage user accounts  
- 📄 **Job Listings** – browse available tutor / lab assistant roles  
- 💼 **Applications** – apply for positions directly in the platform  
- 🗂️ **User Dashboard** – view active / past applications  
- 🗃️ **Admin Panel** (PA, CR and DI) – manage accounts and postings  
- 🔐 **Session Storage** – logged in user info is stored as a **hashed token** in localStorage  

> ✅ All **PA**, **CR**, **DI** tasks implemented  
> ❌ **HD** task not implemented

---

## 🖼️ Screenshots

| Page                  | Screenshot |
|-----------------------|------------|
| **Login Page**        | ![Login Page](./screenshots/login.png) |
| **Home / Job List**   | ![Job List](./screenshots/job-list.png) |
| **User Dashboard**    | ![User Dashboard](./screenshots/dashboard.png) |
| **Admin Panel**       | ![Admin Panel](./screenshots/admin-panel.png) |

> 💡 *Place your actual screenshots inside a folder called `/screenshots` in the root of the repository.*

---

## 🛠️ How to Run the Project

**1. Clone the repository**

```bash
git clone https://github.com/rmit-fsd-2025-s1/s4095471-s4093817-a2.git
cd s4095471-s4093817-a2
```

## 2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## 3. Start the dev servers

```bash
# Frontend
npm run dev

# Backend
npm run dev
```

💡 You will need to have **MySQL / phpMyAdmin** running locally to view the database

📌 **Login Information**  
All existing account passwords are: `Password123!`  
Passwords in the database are already **hashed**

---

## 🌐 Technologies Used

| Category      | Technologies / Libraries                      |
|---------------|-----------------------------------------------|
| Frontend      | React (Next.js), TypeScript, ShadCN UI        |
| Backend       | Node.js, Express, TypeORM                     |
| DB / Tools    | MySQL, phpMyAdmin, Excalidraw                 |
| Security      | bcrypt                                        |
| Charts / UI   | Recharts, React Loading Icons                 |
| Testing       | Jest, Babel                                   |
| Validation    | Zod                                           |
| CI / Linting  | ESLint                                        |
