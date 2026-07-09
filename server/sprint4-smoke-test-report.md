# Sprint-4 Auth Smoke Test Report

Date: 2026-07-10

Server: http://localhost:4001

## Summary
- All 14 auth-related test cases passed.
- Signup, login, JWT issuance, and verification are working correctly.
- Ownership enforcement in the service layer correctly blocks cross-user modifications with 403.
- GET routes remain publicly accessible without authentication.

## Detailed Results

### Authentication

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 1 | Signup User A | 201 | 201 | ✔ PASS |
| 2 | Signup User B | 201 | 201 | ✔ PASS |
| 3 | Duplicate signup (same email) | 409 | 409 | ✔ PASS |
| 4 | Login User A | 200 + token | 200 + token | ✔ PASS |
| 5 | Login with wrong password | 401 | 401 | ✔ PASS |
| 6 | Login with non-existent email | 401 | 401 | ✔ PASS |

### Route Protection

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 7 | GET /api/snippets (no token) | 200 | 200 | ✔ PASS |
| 8 | POST /api/snippets (no token) | 401 | 401 | ✔ PASS |

### Ownership Enforcement

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 9 | User A creates snippet | 201, ownerId = A | 201, ownerId = A | ✔ PASS |
| 10 | User A updates own snippet | 200 | 200 | ✔ PASS |
| 11 | ★ User B updates User A's snippet | 403 | 403 | ✔ PASS |
| 12 | ★ User B deletes User A's snippet | 403 | 403 | ✔ PASS |
| 13 | User A deletes own snippet | 204 | 204 | ✔ PASS |
| 14 | GET deleted snippet | 404 | 404 | ✔ PASS |

## Raw Test Summary (JSON)

```json
{
  "userA": {
    "id": "94ed09de-0ad4-41ba-9b8e-c68025373e71",
    "email": "usera_1783633917327@smoke.test"
  },
  "userB": {
    "id": "3dcf9443-0279-43ec-838d-aaa69c8bb540",
    "email": "userb_1783633917327@smoke.test"
  },
  "snippetId": "2bfad4eb-7b8f-4a48-857a-d4b726c126df",
  "results": {
    "signup": "PASS",
    "duplicateSignup": "PASS (409)",
    "login": "PASS",
    "wrongPassword": "PASS (401)",
    "unknownEmail": "PASS (401)",
    "publicGET": "PASS (200, no token)",
    "unauthPOST": "PASS (401)",
    "ownerCreate": "PASS (201)",
    "ownerUpdate": "PASS (200)",
    "crossUserUpdate": "PASS (403)",
    "crossUserDelete": "PASS (403)",
    "ownerDelete": "PASS (204)",
    "postDeleteGET": "PASS (404)"
  }
}
```

## Bug Fixed During Review

In `auth.service.ts`, the `login` function's password-mismatch branch threw a generic `new Error()` with a manually attached `statusCode` property instead of using `UnauthorizedError`. The error middleware only checks `instanceof UnauthorizedError`, so wrong-password attempts would have returned 500 instead of 401. Fixed before running the test.

## Notes
- Tests were performed using an automated script at `server/src/smoke-test-sprint4.ts`.
- Test users were created with timestamped emails and cleaned up via Prisma after the test run.
- The critical negative cases (tests 11 and 12) confirm that the ownership enforcement in the service layer is working correctly — a user cannot modify or delete another user's snippet.
