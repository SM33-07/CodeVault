# Prisma Version Notes

- `app/` uses Prisma: **7.8.0** (see `app/package.json`).
- `server/` uses Prisma: **4.15.0** (see `server/package.json`).

Recommendation: choose a single Prisma major version for the monorepo before expanding the schema. Prefer upgrading `server/` to Prisma 7.x to match `app/` as Prisma 7 introduces config changes and driver adapters.

Action items:
- Evaluate upgrade path for `server/` to Prisma 7 (follow Prisma upgrade guide).
- If upgrading, run `npm i prisma@7 @prisma/client@7` inside `server/`, update `prisma.config.ts` if needed, and re-run migrations.
