<div align="center">

# 🔐 CodeVault

**Stop losing your best code. Start curating it.**

*An open-source, self-hostable code snippet manager built for developers who are tired of scattered code across Slack threads, sticky notes, and forgotten Gists.*

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io)
[![Sprint](https://img.shields.io/badge/Sprint-6%2F6%20Complete-brightgreen.svg)](#-the-build-journey--sprint-roadmap)
[![Docker](https://img.shields.io/badge/Docker-Compose_Ready-2496ED.svg)](#-docker-quickstart)

</div>

---

## 💡 Why CodeVault?

Ever written the perfect regex pattern, a clean debounce function, or that one Dockerfile `CMD` you always forget — only to lose it in a sea of browser tabs and old repos?

**We've all been there.**

GitHub Gists give you storage, but not *structure*. Notes apps give you organization, but not *syntax highlighting*. Slack bookmarks give you... nothing useful a week later.

**CodeVault is different.** It's the snippet library you'd build for yourself if you had a weekend — except it's already built, fully self-hostable, and comes with features designed specifically for engineering workflows:

| The Problem | How CodeVault Solves It |
|---|---|
| 😩 *"I wrote a great utility function last month... where was it?"* | 🔍 **Instant Search** by keyword, language, or tag — find it in milliseconds |
| 😩 *"I want to save this from a colleague's repo but keep my own copy"* | 🔀 **Fork Lineage** with full bidirectional ancestry tracking back to the original author |
| 😩 *"Which of my snippets are actually useful to others?"* | 📊 **View & Fork Analytics** with honest non-owner view incrementation |
| 😩 *"I need to share my best work without giving away everything"* | 🔒 **Public / Private Visibility** with strict ownership enforcement |
| 😩 *"What does this inherited regex actually do?"* | 🤖 **AI Explanations** powered by Google Gemini with graceful fallback |

---

## 🏗️ Architecture at a Glance

CodeVault follows a clean **three-tier architecture** — the frontend never talks to the database or AI provider directly. Every request flows through the Express API, which enforces authentication, ownership, and validation before anything touches your data.

```text
┌─────────────────────────────────────────────────────────┐
│            Next.js 16 Web Application                   │
│  Aceternity 3D Hero · Lineage Graph · Dashboard · ⌘K   │   ← Frontend (Port 3000)
└────────────────────────────┬────────────────────────────┘
                             │  REST + JWT Bearer Token / OAuth
┌────────────────────────────▼────────────────────────────┐
│                  Express API Layer                      │
│   Auth Middleware · Zod Validation · Security & CORS    │   ← Backend (Port 4001)
├───────────────┬────────────────────┬────────────────────┤
│  Auth Service │  Snippet Service   │ Fork & AI Service  │
│ (bcrypt / JWT)│ (CRUD + Search)    │(Lineage + Gemini)  │
└───────────────┴──────────┬─────────┴────────────────────┘
                           │  Prisma ORM
┌──────────────────────────▼──────────────────────────────┐
│                PostgreSQL Database                      │
│     Users · Snippets · Tags · SnippetTags (M:N)         │   ← Database (Port 5432)
└──────────────────────────┬──────────────────────────────┘
                           │  Server-Side On-Demand
┌──────────────────────────▼──────────────────────────────┐
│                 Google Gemini AI                        │   ← AI Service
│        (API Key secured on backend only)                │
└─────────────────────────────────────────────────────────┘
```

> **Design principle**: The AI feature degrades gracefully — if the AI service is unavailable, every other feature keeps working. CodeVault is a snippet manager first, AI tool second.

---

## 🗺️ The Build Journey — Sprint Roadmap

CodeVault was built **sprint by sprint**, where each sprint introduces exactly one architectural layer on top of a fully tested system.

| Sprint | Focus Area | Architectural Milestone | Status |
|:---:|---|---|:---:|
| **1** | 🟢 REST API Foundation | Express + TypeScript in-memory CRUD architecture | ✅ |
| **2** | 🟢 Database Persistence | PostgreSQL 16 + Prisma ORM schema migrations | ✅ |
| **3** | 🟢 Relations & Validation | Many-to-many tag relations with Zod schema validation | ✅ |
| **4** | 🟢 Auth & Security | Stateless JWT authentication, bcrypt password hashing & ownership guards | ✅ |
| **5** | 🟢 Lineage & Analytics | GitHub-style forking, provenance tree tracking, and non-owner view counters | ✅ |
| **6** | 🟢 Full-Stack Experience | Next.js 16 UI, Aceternity 3D Hero, Gemini AI Explanations, and Dockerization | ✅ |

> 📝 Automated smoke test suites are available for every sprint. Sprint 6 runs **20 automated tests** covering profiles, visibility rules, AI explanation, and ownership enforcement — all passing at 100%.

---

## ✨ Key Features

### 🔐 Authentication & Access Control
- Email/password authentication with bcrypt hashing (configurable salt rounds)
- Stateless JWT issuance with configurable expiry (`7d`)
- GitHub & Google OAuth integration
- Ownership guards prevent unauthorized edits or deletions (`403 Forbidden`)

### 📝 Snippet Management & Syntax Highlighting
- Full CRUD operations with multi-language syntax highlighting
- Tagging system with many-to-many database relationships
- Public / Private visibility toggles (private snippets are strictly owner-eyes-only)

### 🔍 Multi-Dimensional Search
- Filter composably by `?language=typescript`, `?tag=api`, or keyword `?q=auth`
- Fast PostgreSQL index-accelerated queries
- Authenticated users see their own private snippets in search results; visitors see public only

### 🔀 Provenance & Fork Lineage Engine
- 1-click forking with bidirectional ancestry tracking (`forkedFromId`)
- Original author attribution remains immutable across all downstream branches
- Interactive Provenance & Fork Lineage Graph with live branch simulation

### 🤖 On-Demand AI Code Explanation
- Instant code breakdown explaining runtime behavior, algorithmic complexity, and potential edge cases
- Powered server-side by Google Gemini — zero client-side API key leakage
- Gracefully degrades if AI service quotas or keys are unavailable

### 💻 Developer Experience & Shortcuts
- Global command menu (`⌘K` / `Ctrl+K`) for lightning-fast snippet search
- Global Developer Shortcuts HUD (`?` key overlay)
- Interactive floating snippet cards with 1-click clipboard copying

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (Turbopack, App Router) | React Server Components, client state, modern UX |
| **Styling & UI** | Tailwind CSS v4, Framer Motion | High-performance styling, glassmorphism, 3D scroll physics |
| **Backend** | Node.js + Express + TypeScript | RESTful API endpoints, request pipeline, security layers |
| **Database** | PostgreSQL 16 | Relational data integrity, foreign keys, indexes |
| **ORM** | Prisma ORM | Type-safe queries, declarative schema migrations |
| **Authentication**| JWT + bcryptjs + OAuth | Stateless token authentication & password hashing |
| **Validation** | Zod | Runtime request body and query param schema validation |
| **AI Engine** | Google Gemini AI (`@google/genai`) | Automated code analysis and snippet explanation |
| **Containerization**| Docker & Docker Compose | Multi-container full-stack deployment |

---

## 🐳 Docker Quickstart

CodeVault is pre-configured for one-command multi-container deployment:

```bash
# 1. Clone the repository
git clone https://github.com/SM33-07/CodeVault.git
cd CodeVault

# 2. Launch the full stack (PostgreSQL + Express API + Next.js App)
docker compose up -d
```

Once running:
* **Frontend Web App**: `http://localhost:3000`
* **Express REST API**: `http://localhost:4001`
* **PostgreSQL Database**: `localhost:5432`

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** instance (local or cloud)
- **npm** (or pnpm)

### Step-by-Step Setup

```bash
# 1. Clone the monorepo
git clone https://github.com/SM33-07/CodeVault.git
cd CodeVault

# 2. Install root dependencies
npm install

# 3. Configure Server Environment — create server/.env
```

```env
PORT=4001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/codevault?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
GEMINI_API_KEY="your-gemini-api-key"
CORS_ORIGIN="http://localhost:3000"
```

```bash
# 4. Run Prisma Migrations
cd server
npx prisma generate
npx prisma migrate dev
cd ..

# 5. Start Full-Stack Development Servers (API on 4001, App on 3000)
npm run dev
```

### Verify Everything Works (Sprint 6 Smoke Tests)

```bash
cd server
npx ts-node-dev --transpile-only src/smoke-test-sprint6.ts
```

Output:
```text
======================================================
=== ALL 20 SPRINT-6 SMOKE TESTS PASSED (100%) ===
======================================================
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | `{ email, password }` | Register account (`201` — `{ token, user }`) |
| `POST` | `/api/auth/login` | `{ email, password }` | Authenticate (`200` — `{ token, user }`) |

### Snippets & Lineage

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/snippets` | Optional | List snippets with `?tag=`, `?language=`, `?q=` |
| `POST` | `/api/snippets` | 🔒 Required | Create new snippet |
| `GET` | `/api/snippets/:id` | Optional | View snippet (increments non-owner view count) |
| `PUT` | `/api/snippets/:id` | 🔒 Owner only | Update snippet |
| `DELETE` | `/api/snippets/:id` | 🔒 Owner only | Delete snippet |
| `POST` | `/api/snippets/:id/fork` | 🔒 Required | Fork public snippet with lineage tracking |
| `POST` | `/api/snippets/:id/explain`| 🔒 Required | Generate Gemini AI code explanation |

---

## 📁 Project Structure

```text
CodeVault/
├── app/                             # Next.js 16 Frontend Web Application
│   ├── src/
│   │   ├── app/                     # App Router pages (/, /snippets, /dashboard, /profile)
│   │   ├── components/              # UI Components (Landing, BentoGrid, LineageGraph, 3D Hero)
│   │   ├── hooks/                   # React custom hooks (useAuth, useFork, useKeyboardShortcuts)
│   │   └── lib/                     # API client utilities and helpers
├── server/                          # Express + Prisma Backend
│   ├── src/
│   │   ├── controllers/             # Route handlers (auth, snippet, fork, explain)
│   │   ├── services/                # Business logic & ownership enforcement
│   │   ├── repositories/            # Prisma database query layer
│   │   ├── middlewares/             # Auth, error handler, Zod validation
│   │   └── validation/              # Zod input schemas
│   ├── prisma/
│   │   └── schema.prisma            # Database schema (User, Snippet, Tag, SnippetTag)
│   └── smoke-test-sprint6.ts        # Automated smoke test suite (20 tests)
├── docker-compose.yml               # Multi-container orchestration
└── README.md                        # Project documentation
```

---

## 🤝 Contributing

Contributions, feedback, and feature requests are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License & Author

Built by **[Soham More](https://github.com/SM33-07)** (`sohammore3312@gmail.com`) — [LinkedIn](https://www.linkedin.com/in/soham-more/)

Licensed under the [MIT License](LICENSE). Feel free to fork, self-host, and build upon it!