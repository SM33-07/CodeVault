# CodeVault Sprint 2 — Express + Prisma scaffold

Minimal scaffold for Sprint‑2: an Express + TypeScript API using Prisma (Postgres).

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
cd sprint2-api
npm install
```

3. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Run the dev server:

```bash
npm run dev
```

API
- `GET /api/snippets`
- `POST /api/snippets`
- `GET /api/snippets/:id`
- `PUT /api/snippets/:id`
- `DELETE /api/snippets/:id`

Notes
- This scaffold uses Prisma and expects a Postgres `DATABASE_URL`.
- The migration command will create an initial `Snippet` table. Seed is not included.
