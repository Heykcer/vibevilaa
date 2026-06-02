# 🏠 Vibevilaa Backend Server

Welcome to the **Vibevilaa Backend Server**, the core API engine powering the Vibevilaa application ecosystem. Built with a modern, modular, and robust Node.js / Express architecture, it delivers speed, security, and high code quality.

---

## 🚀 Key Features

- **⚡ Modern Architecture**: Written using modern ECMAScript Modules (`import`/`export` syntax).
- **🛡️ Production-grade Security**: Equipped with [Helmet](https://helmetjs.github.io/) to secure HTTP headers and custom [CORS](https://github.com/expressjs/cors) policies.
- **📡 Database Resilience**: Connected via MongoDB & Mongoose, with a smart connection fallback mechanism that keeps the server alive in mock/offline mode if MongoDB isn't running.
- **🛑 Centralized Error Handling**: Standardized controller-to-middleware error handling providing consistent, debuggable error responses.
- **🧼 High Standards of Code Quality**: Integrated with **ESLint 9 (Flat Config)** and **Prettier** for automated formatting and lint checks.

---

## 📂 Directory Structure

Here's an overview of the server's codebase layout:

```yaml
backend/
├── src/
│   ├── config/              # Configuration (e.g., Database connection)
│   │   └── db.js
│   ├── controllers/         # Request handling & Business logic
│   │   └── indexController.js
│   ├── middleware/          # Custom express middleware (Error handlers)
│   │   └── errorHandler.js
│   ├── routes/              # Express API Route declarations
│   │   └── api.js
│   ├── app.js               # Express application configuration & assembly
│   └── server.js            # Server entry point (Ports & DB Initialization)
├── eslint.config.js         # ESLint Flat configuration
├── .prettierrc              # Prettier style preferences
├── .prettierignore          # Files ignored by Prettier formatting
├── .env.example             # Template for environment variables
└── package.json             # Scripts & dependency definitions
```

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Node.js (v18+)
- **Framework**: [Express.js v5.0.0](https://expressjs.com/)
- **Database ODM**: [Mongoose](https://mongoosejs.com/)
- **Security & Loggers**: [Helmet](https://helmetjs.github.io/), [Cors](https://github.com/expressjs/cors), [Morgan](https://github.com/expressjs/morgan)
- **Development / Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Nodemon](https://nodemon.io/)

---

## ⚙️ Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 📥 1. Installation

Navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install
```

### 🔑 2. Environment Configuration

Create a `.env` file in the root of the `backend/` directory. You can copy the template from `.env.example`:

```bash
cp .env.example .env
```

Inside your `.env` file, configure your variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vibevilaa
```

### 🛰️ 3. Running the Server

#### 🪵 Development Mode (with Hot Reloading)

Launches the server using `nodemon` which watches for file changes and restarts automatically:

```bash
npm run dev
```

#### 🚢 Production Mode

Runs the optimized server using standard Node.js:

```bash
npm start
```

---

## 🧭 API Endpoints

All routes are prefixed with `/api`. Here are the default endpoints available:

| Endpoint      | Method | Access | Description                                            |
| :------------ | :----- | :----- | :----------------------------------------------------- |
| `/api`        | `GET`  | Public | Welcome endpoint returning API details & version       |
| `/api/status` | `GET`  | Public | Health status check, server uptime, and system metrics |

### Example Response (`GET /api/status`)

```json
{
  "success": true,
  "message": "Vibevilaa API server is fully operational",
  "timestamp": "2026-05-30T10:00:00.000Z",
  "uptime": "120.45 seconds",
  "environment": "development"
}
```

---

## 🧼 Code Quality & Formatting

To maintain a pristine code style, we use a combined ESLint + Prettier workflow.

### Formatting Style Preferences

- **Indent**: `2 Spaces`
- **Quotes**: `Single Quotes` (`'example'`)
- **Semicolons**: `Enabled` (`semi: true`)
- **Trailing Commas**: `ES5 compatible`
- **Print Width**: `100 characters`

### Available Commands

| Command            | Action                                                  |
| :----------------- | :------------------------------------------------------ |
| `npm run lint`     | Analyze files for potential errors and styling warnings |
| `npm run lint:fix` | Automatically resolve repairable ESLint warnings        |
| `npm run format`   | Enforce consistent code formatting using Prettier       |

---

## 📝 License

This project is licensed under the ISC License.
