# 🚀 DevPulse – Internal Tech Issue Tracker API

DevPulse is a backend API for managing internal software issues and feature requests.  
It allows team members to report bugs, suggest features, and manage issue workflows with role-based access control.

---

## 🛠️ Tech Stack

- Node.js (LTS)
- Express.js
- TypeScript
- PostgreSQL (Raw SQL only)
- JWT (Authentication)
- bcrypt (Password hashing)

---

## 👥 User Roles

### Contributor

- Register & Login
- Create issues (bug / feature_request)
- View all issues

### Maintainer

- All contributor permissions
- Update any issue
- Delete issues
- Manage workflow status

---

## 🔐 Authentication

Uses JWT-based authentication.

### Flow:

1. User logs in
2. Server returns JWT token
3. Client sends token in headers:
4. Server verifies token before protected routes

---

## 📦 Installation

```bash
git clone https://github.com/Rayhan-abdullha/devPuls-api.git
cd devPuls-api
npm install
```
