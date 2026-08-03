<div align="center">

# 🔐 CodeVault

**Stop losing your best code. Start curating it.**

*An open-source, self-hostable code snippet manager built for developers who are tired of scattered code across Slack threads, sticky notes, and forgotten Gists.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_ORM-336791.svg)](https://www.prisma.io/)
[![Sprint](https://img.shields.io/badge/Sprint-5%2F6-orange.svg)](#-the-build-journey--sprint-roadmap)

</div>

---

## 💡 Why CodeVault?

Ever written the perfect regex pattern, a clean debounce function, or that one Dockerfile `CMD` you always forget — only to lose it in a sea of browser tabs and old repos?

**We've all been there.**

GitHub Gists give you storage, but not *structure*. Notes apps give you organization, but not *syntax highlighting*. Slack bookmarks give you... nothing useful a week later.

**CodeVault is different.** It's the snippet library you'd build for yourself if you had a weekend — except it's already built, fully self-hostable, and comes with features you didn't know you wanted:

| The Problem | How CodeVault Solves It |
|---|---|
| 😩 *"I wrote a great utility function last month... where was it?"* | 🔍 Search by keyword, language, or tag — find it in seconds |
| 😩 *"I want to save this from a colleague's repo but keep my own copy"* | 🔀 Fork any public snippet — full lineage tracked back to the original |
| 😩 *"Which of my snippets are actually useful to others?"* | 📊 Built-in view counts and fork analytics per snippet |
| 😩 *"I need to share my best work without giving away everything"* | 🔒 Public/private visibility — you control what the world sees |
| 😩 *"What does this inherited regex actually do?"* | 🤖 Ask the AI — on-demand Claude-powered explanations *(coming Sprint 6)* |

---

## 🏗️ Architecture at a Glance

CodeVault follows a clean **three-tier architecture** — the frontend never talks to the database or AI provider directly. Every request flows through the Express API, which enforces authentication, ownership, and validation before anything touches your data.

```
┌─────────────────────────────────────────────┐
│            Next.js Dashboard                │
│   Search · Library · Profiles · Editor      │    ← Sprint 6
└───────────────────┬─────────────────────────┘
                    │  REST + JWT Bearer Token
┌───────────────────▼─────────────────────────┐
│            Express API Layer                │
│   Auth Middleware · Zod Validation · CORS   │    ← You are here
├──────────┬────────────┬─────────────────────┤
│  Auth    │  Snippet   │  Fork & Analytics   │
│  Service │  Service   │  Services           │
│ (bcrypt) │ (CRUD+Search) │ (lineage+views)  │
└──────────┴─────┬──────┴─────────────────────┘
                 │  Prisma ORM
┌────────────────▼────────────────────────────┐
│          PostgreSQL Database                │
│  Users · Snippets · Tags · SnippetTags      │
└────────────────┬────────────────────────────┘
                 │  Server-side, on-demand
┌────────────────▼────────────────────────────┐
│         Anthropic Claude API                │    ← Sprint 6
│     (AI key never exposed to client)        │
└─────────────────────────────────────────────┘
```

> **Design principle**: The AI feature degrades gracefully — if Claude is unavailable, every other feature keeps working. CodeVault is a snippet manager first, AI tool second.

---

## 🗺️ The Build Journey — Sprint Roadmap

CodeVault isn't a weekend hackathon project that tries to do everything at once. It's built **sprint by sprint**, where each sprint introduces exactly one architectural concept on top of a fully working system.

| Sprint | What Changed | What It Proved | Status |
|:---:|---|---|:---:|
| **1** | 🟢 Express + in-memory CRUD | *"Can I build a working REST API from scratch?"* | ✅ |
| **2** | 🟢 PostgreSQL + Prisma ORM | *"Can I persist data and design a real schema?"* | ✅ |
| **3** | 🟢 Relations + Zod validation | *"Can I model many-to-many relationships and reject bad input?"* | ✅ |
| **4** | 🟢 JWT auth + ownership | *"Can I secure routes and enforce 'you can only edit your own stuff'?"* | ✅ |
| **5** | 🟢 Search, forking, analytics | *"Can I build GitHub-style forking, multi-filter search, and view tracking?"* | ✅ |
| **6** | 🔵 Next.js + AI + deploy | *"Can I ship a polished product with a real UI and an AI feature?"* | ⏳ |

> 📝 Each sprint has its own automated smoke test suite. Sprint 5 runs **20 tests** covering search filters, visibility rules, forking guards, and analytics — all passing.

---

## ✨ What's Working Right Now

### 🔐 Authentication & Security
> *Signup → bcrypt hash → JWT issued → Bearer token on every protected request*

- Email/password registration with duplicate detection (409)
- Secure password storage (bcrypt, configurable salt rounds)
- JWT tokens with configurable expiry
- Protected routes return `401` without a valid token

### 📝 Snippet CRUD with Visibility Controls
> *Create it, tag it, make it public or keep it private — your call*

- Full create, read, update, delete with ownership enforcement
- `public` snippets are visible to everyone; `private` snippets are owner-eyes-only
- Non-owners who try to edit or delete get a clean `403 Forbidden`

### 🔍 Smart Search & Filtering
> *"Show me all my TypeScript snippets tagged 'api' that mention 'auth'"*

- **`?language=typescript`** — filter by programming language (case-insensitive)
- **`?tag=api`** — filter by tag name across the many-to-many relation
- **`?q=auth`** — keyword search across title and description
- **All filters composable** — combine any or all in a single query
- Authenticated users see their own private snippets in results; visitors see public only

### 🔀 GitHub-Style Forking
> *Found a useful public snippet? Fork it into your own library with one request.*

- `POST /api/snippets/:id/fork` creates a full copy under your account
- Original snippet's `forkCount` increments automatically
- `forkedFromId` preserves the lineage chain back to the source
- Tags are carried over to the fork
- Private snippets **cannot** be forked by non-owners (`403`)

### 📊 View Analytics
> *Your public snippet on Express error handling? 47 views and counting.*

- `viewCount` increments each time a non-owner views a public snippet
- Owner views do **not** inflate the count — analytics stay honest
- Fork counts tracked separately on the original snippet

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Runtime** | Node.js + Express | Battle-tested, async-first, massive ecosystem |
| **Language** | TypeScript (strict) | Type safety across the full backend |
| **Database** | PostgreSQL | Relational data with strong integrity guarantees |
| **ORM** | Prisma | Type-safe queries, migration management, schema-as-code |
| **Auth** | JWT + bcrypt | Stateless auth, industry-standard password hashing |
| **Validation** | Zod | Runtime schema validation with TypeScript inference |
| **Frontend** | Next.js *(Sprint 6)* | SSR, file-based routing, React ecosystem |
| **AI** | Anthropic Claude *(Sprint 6)* | Server-side only — API key never reaches the client |
| **Infra** | Docker + Compose *(Sprint 6)* | One-command self-hosting |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** instance (local or hosted)
- **npm** (or pnpm)

### Setup in 5 Steps

```bash
# 1. Clone
git clone https://github.com/SM33-07/CodeVault.git
cd CodeVault/server

# 2. Install
npm install

# 3. Configure — create server/.env
```

```env
PORT=4001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/codevault?schema=public"
JWT_SECRET="replace-with-a-strong-random-string"
JWT_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
```

```bash
# 4. Database setup
npx prisma generate
npx prisma migrate dev

# 5. Launch
npm run dev
# → CodeVault API running at http://localhost:4001
```

### Verify Everything Works

```bash
# Run the Sprint 5 smoke test (20 tests)
npx ts-node-dev --transpile-only src/smoke-test-sprint5.ts
```

You should see:
```
=== ALL 20 SPRINT-5 SMOKE TESTS PASSED! ===
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/signup` | `{ email, password }` | `201` — `{ token, user }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `200` — `{ token, user }` |

### Snippets

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/snippets` | Optional | List snippets — supports `?tag=`, `?language=`, `?q=` |
| `POST` | `/api/snippets` | 🔒 Required | Create snippet |
| `GET` | `/api/snippets/:id` | Optional | View snippet (increments `viewCount` for non-owner) |
| `PUT` | `/api/snippets/:id` | 🔒 Owner only | Update snippet |
| `DELETE` | `/api/snippets/:id` | 🔒 Owner only | Delete snippet |
| `POST` | `/api/snippets/:id/fork` | 🔒 Required | Fork a public snippet into your account |

### Quick Example

```bash
# Sign up
curl -X POST http://localhost:4001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "password": "SecureP@ss1"}'

# Create a snippet (use the token from signup)
curl -X POST http://localhost:4001/api/snippets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Express Error Handler",
    "codeBody": "app.use((err, req, res, next) => { res.status(500).json({ error: err.message }); });",
    "language": "typescript",
    "visibility": "public",
    "description": "Catch-all error middleware for Express"
  }'

# Search for it
curl "http://localhost:4001/api/snippets?q=error&language=typescript"
```

---

## 📁 Project Structure

```
CodeVault/
├── server/                          # Express API (Sprints 1–5)
│   ├── src/
│   │   ├── controllers/             # Route handlers
│   │   ├── services/                # Business logic & ownership enforcement
│   │   ├── repositories/            # Prisma database queries
│   │   ├── middlewares/              # Auth, validation, error handling
│   │   ├── validation/              # Zod schemas
│   │   ├── errors/                  # Custom error classes (NotFound, Forbidden, etc.)
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── config/                  # Environment & logger setup
│   │   └── prisma/                  # Prisma client instance
│   ├── prisma/
│   │   └── schema.prisma            # Database schema (User, Snippet, Tag, SnippetTag)
│   └── sprint5-smoke-test-report.md # Latest test results
├── app/                             # Next.js frontend (Sprint 6 — scaffolded)
├── srs_text.txt                     # Full Software Requirements Specification
└── README.md                        # ← You are here
```

---

## 🔮 What's Next — Roadmap

### Sprint 6 (In Progress)
- 🎨 **Next.js Dashboard** — snippet library UI with syntax highlighting, dark mode, and responsive design
- 👤 **Public Profiles** — shareable `/u/username` pages showcasing a developer's public snippets
- 🤖 **AI Explanations** — "Explain this snippet" button powered by Anthropic Claude (server-side, gracefully degrading)
- 🐳 **Docker Deployment** — one-command `docker compose up` for self-hosting

### Future (v2+)
- 👥 **Team Workspaces** — shared snippet libraries with role-based access
- 📜 **Version History** — track how a snippet evolves with diffs over time
- ⚡ **Real-Time Collaboration** — live co-editing (think Google Docs for code blocks)
- 💬 **Social Features** — comments, stars, and curated community collections
- 💾 **Cached AI Explanations** — persist generated explanations to skip redundant API calls

---

## 🤝 Contributing

CodeVault is a personal engineering project, but contributions and feedback are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

Built by **[Soham More](https://github.com/SM33-07)** — a personal full-stack engineering project and portfolio reference.

Licensed under the [MIT License](LICENSE). Use it, fork it, self-host it, make it yours.