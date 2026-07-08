# Sprint-2 API Smoke Test Report

Date: 2026-07-08

Server: http://localhost:4001

Summary
- All CRUD endpoints responded as expected against the Prisma-backed DB.
- Created snippet ID: `fd257821-2be1-46e6-a466-d9fcc748d151`.

Detailed results

1) POST /api/snippets
- Request payload: title, codeBody, language, description, visibility
- Response: 201 Created with JSON body (created record with `id`, timestamps)

2) GET /api/snippets
- Response: 200 OK, returned list containing the created snippet (see ID above).

3) GET /api/snippets/:id
- Response: 200 OK, returned the created snippet JSON.

4) PUT /api/snippets/:id
- Request: `{"description":"updated-smoke"}`
- Response: 200 OK, returned updated snippet with `description: updated-smoke`.

5) DELETE /api/snippets/:id
- Response: 204 No Content.
- Subsequent GET returned not found as expected.

Raw test summary (JSON)

```
{ "create": { "id": "fd257821-2be1-46e6-a466-d9fcc748d151", "title": "Smoke Snippet" }, "list": [...], "get": {...}, "update": {...}, "deleteStatus": 204, "postDeleteStatus": "NotFound" }
```

Notes
- Tests were performed against the running dev server using PowerShell `Invoke-RestMethod`/`Invoke-WebRequest`.
- The database migration was applied earlier; Prisma Client is generated.
