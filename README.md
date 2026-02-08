# 🏆 GOLDEN NOTES | Production-Ready Web Vault
  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

##  Project Overview
**GOLDEN NOTES** is a secure, full-stack personal records management system designed with a "Security-First" philosophy. This application demonstrates a modern **Single Page Application (SPA)** architecture, featuring robust authentication, Role-Based Access Control (RBAC), and persistent cloud data storage.

---
## Key Features

* **Advanced Security**: Industry-standard password hashing using `bcrypt`.
* **Session Management**: Persistent user sessions via `express-session` stored in MongoDB.
* **RBAC (Role-Based Access Control)**: Distinct permissions for `user` and `admin` roles.
* **Fluid UX**: SPA architecture with real-time search, pagination, and modal-based navigation.
* **Cloud Database**: Fully integrated with MongoDB Atlas for reliable data persistence.
* **Support System**: Integrated contact form archiving submissions to `contacts.json`.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Modern Flexbox/Grid), Vanilla JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (NoSQL) |
| **Auth** | Bcrypt (Hashing), Express-Session (State Management) |
| **Deployment** | Render.com |

---

## ⚡︎ Security Implementations 

1.  **Password Hashing**: We never store plain-text passwords. Every password is processed through `bcrypt` with a salt factor of `10`.
2.  **Protected Endpoints**: All API routes for `POST`, `PUT`, and `DELETE` are gated behind custom `isAuth` middleware.
3.  **Owner-Only Access**: Authorization logic ensures users can only modify or delete records they created.
4.  **Data Integrity**: A unique index on the `email` field prevents account duplication at the database level.
5.  **Environment Variables**: All secrets (DB URIs, Session Keys) are managed through `.env` to prevent credential leaking.



---

## ↓  Project Structure
```text
personal-notes-manager
├── server.js              # Entry point & Middleware configuration
├── database/
│   └── db.js              # Atlas Connection & Indexing logic
├── routes/
│   ├── auth.js            # Registration & Login endpoints
│   └── notes.js           # Protected CRUD API for records
├── views/
│   └── index.html         # Unified SPA Dashboard
├── public/
│   └── style.css          # Professional "Golden Dark" UI
└── data/
    └── contacts.json      # Encrypted Support Logs
```
## ⚙︎ Installation & Setup
1. Clone & Install:
```
npm install
```
2. Configure Environment: Create a .env file and add your MONGO_URI and SESSION_SECRET.

3. Run Application:

```
npm start
```
## ✕ Database Schema
| Field      | Type   | Notes                             |
| ---------- | ------ | --------------------------------- |
| `email`    | String | Unique Index (Primary Identifier) |
| `password` | String | Hashed via **bcrypt**             |
| `role`     | String | `user` | `admin`                  |

| Field      | Type     | Relation / Validation                 |
| ---------- | -------- | ------------------------------------- |
| `title`    | String   | Minimum **3 characters**              |
| `content`  | String   | Encrypted note body                   |
| `userId`   | ObjectId | Reference to `users._id` (owner)      |
| `priority` | String   | Enum: `Low` | `Normal` | `High`       |
| `category` | String   | Example: `Work`, `Personal`, `Health` |

## 👥 Authors
‣Kausar Tukezhan - Lead Developer

‣Behruz Tokkhtamishov - Database Architecture

‣Ginayat Yerassyl - UI/UX Design
