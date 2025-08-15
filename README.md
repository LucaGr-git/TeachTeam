# TeachTeam / Tutor - Lab Assistant Job Platform

A full-stack **React + TypeScript + Next.js** application designed to help students apply for **tutor and lab assistant jobs**.  


---

## 👨‍💻 Group Details

| Name         | Student ID | Email                                      |
|--------------|------------|--------------------------------------------|
| Luca Grosso  | s4093817   | s4093817@student.rmit.edu.au               |
| Alysha Khan  | s4095471   | s4095471@student.rmit.edu.au               |

**Branch:** `main` (contains the most recent version)

---

## 🚀 Key Features
- **Account Management** – create, log in, and manage user accounts  
- **Job Listings** – browse available tutor / lab assistant roles  
- **Applications** – apply for positions directly in the platform  
- **User Dashboard** – view active / past applications  
- **Session Storage** – logged in user info is stored as a **token** in localStorage  
---

## 🖼️ Screenshots

| Page                  | Screenshot |
|-----------------------|------------|
| **Login Page**        | <img width="1886" height="909" alt="Screenshot 2025-08-15 at 11 49 38 pm" src="https://github.com/user-attachments/assets/0241b239-a079-4fa5-9f33-bf654a6970e4" />|
| **Applicant Page**   | <img width="1868" height="915" alt="Screenshot 2025-08-15 at 11 50 32 pm" src="https://github.com/user-attachments/assets/3a6a1e60-51bc-49a7-9e27-94f25be5921a" />|
| **Lecturer Page**     | <img width="1853" height="907" alt="Screenshot 2025-08-15 at 11 50 15 pm" src="https://github.com/user-attachments/assets/1868486c-4add-4eae-baf6-cc622e888df0" />|
---

## 🛠️ How to Run the Project

- You must have a MySQL instance set up and referenced in the data-source.ts in backend

**1. Clone the repository**

```bash
git clone https://github.com/LucaGr-git/TeachTeam
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

You will need to have **MySQL / phpMyAdmin** running locally to view the database

**Login Information**  
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
