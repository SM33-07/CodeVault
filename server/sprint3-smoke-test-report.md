# Sprint-3 API Smoke Test Report

Date: 2026-07-09

Server: http://localhost:4001

Summary
- Tested database relationships between Snippets and Tags.
- Verified input validation rules using Zod middleware constraints.
- Successfully verified creating, retrieving, listing, updating (re-linking and clearing), and deleting a snippet with associated tags.

Detailed results

1) Database Tags Setup
- Verified that tags `javascript`, `typescript`, and `backend` are present or successfully created in the database.
- Retrieved tag IDs:
  - `javascript`: `8b14d808-ffe0-419c-889e-cdcfe3b9915f`
  - `typescript`: `271c1f72-7e6b-47ad-abb4-0b755d5a6a46`
  - `backend`: `ce3dec4a-62f9-49bb-8f3f-f92e052604b2`

2) POST /api/snippets (Creation with tags)
- Request payload:
  ```json
  {
    "title": "Smoke Test Snippet with Tags",
    "codeBody": "console.log(\"hello world\");",
    "language": "typescript",
    "visibility": "public",
    "description": "A temporary snippet to verify tags relation flow.",
    "tagIds": ["8b14d808-ffe0-419c-889e-cdcfe3b9915f", "271c1f72-7e6b-47ad-abb4-0b755d5a6a46"]
  }
  ```
- Response: 201 Created with JSON body, including corresponding relations in `snippetTags`.
- Verified that tags `typescript` and `javascript` were correctly mapped and returned in the nested relation structure.

3) GET /api/snippets/:id (Relation Retrieval)
- Request: `GET /api/snippets/32825752-d6cc-44f1-baed-613103046e2a`
- Response: 200 OK. Correctly fetched the snippet and verified the presence of the mapped tags in the response payload.

4) GET /api/snippets (Snippet List Relation Retrieval)
- Request: `GET /api/snippets`
- Response: 200 OK. Checked that the new snippet appeared in the general list and that its tags list was populated.

5) PUT /api/snippets/:id (Modifying Tag Connections)
- Request payload:
  ```json
  {
    "tagIds": ["271c1f72-7e6b-47ad-abb4-0b755d5a6a46", "ce3dec4a-62f9-49bb-8f3f-f92e052604b2"]
  }
  ```
- Response: 200 OK. Verified database update transaction successfully removed old tag connections (`javascript`) and linked new tag connections (`typescript` and `backend`).

6) PUT /api/snippets/:id (Clearing Tag Connections)
- Request payload:
  ```json
  {
    "tagIds": []
  }
  ```
- Response: 200 OK. Verified database update successfully cleared all tag associations for the snippet.

7) Input Validation Constraints (Zod middleware checks)
- **Case A (Missing required fields):** Sending POST request without `title` returned `400 Bad Request` with Zod validation error detailing that `title` is a required field.
- **Case B (Invalid enum option):** Sending POST request with `visibility: "super-private"` returned `400 Bad Request` with Zod validation error detailing expected options are `"public" | "private"`.
- **Case C (Invalid tag UUIDs):** Sending POST request with `tagIds: ["invalid-uuid-format"]` returned `400 Bad Request` with Zod validation error detailing `tagIds.0` is an invalid UUID format.

8) DELETE /api/snippets/:id
- Response: 204 No Content.
- Subsequent GET requests returned `404 Not Found` as expected.

Raw test summary (JSON)

```json
{
  "tagsCreated": {
    "javascript": "8b14d808-ffe0-419c-889e-cdcfe3b9915f",
    "typescript": "271c1f72-7e6b-47ad-abb4-0b755d5a6a46",
    "backend": "ce3dec4a-62f9-49bb-8f3f-f92e052604b2"
  },
  "snippetIdCreated": "32825752-d6cc-44f1-baed-613103046e2a",
  "crudStatus": "ALL PASSED",
  "validationChecks": "ALL PASSED"
}
```

Notes
- Tests were performed using an automated smoke-test script in `server/src/smoke-test.ts`.
- The database relations and validation rules correctly conform to Sprint-3 specifications before transition to Sprint-4.
